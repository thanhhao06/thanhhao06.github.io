---
author:
  - Azaki
source: https://hackmd.io/@azaki/BJIZye7q-l
published: published
created: 2026-03-16
description:
tags:
  - CTF
---
## Forensic

## Cold Workspace

Challengee cho mình 1 file dump nhưng file này lại quá nhỏ do bị crashed nên không thể dùng Volatility để xem mà phải dùng strings để đọc dữ liệu còn sót lại

Khi dùng strings để đọc dữ liệu mình tìm được thông tin rằng file gốc đã bị xóa và mã hóa kèm theo đó là KEY và IV để giải mã  
![[utctf1.png]]
ENCD: Phần dữ liệu bị mã hóa  
ENCK: KEY  
ENCV: IV

```
ENCD=S4wX8ml7/f9C2ffc8vENqtWw8Bko1RAhCwLLG4vvjeT2iJ26nfeMzWEyx/HlK1KmOhIrSMoWtmgu2OKMtTtUXddZDQ87FTEXIqghzCL6ErnC1+GwpSfzCDr9woKXj5IzcU2C/Ft5u705bY3b6/Z/Q/N6MPLXV55pLzIDnO1nvtja123WWwH54O4mnyWNspt5
ENCK=Ddf4BCsshqFHJxXPr5X6MLPOGtITAmXK3drAqeZoFBU=
ENCV=xXpGwuoqihg/QHFTM2yMxA==
```

Vì đã có file mã hóa kèm KEY và IV nên mình dùng Cyberchef để giải  


> Flag: utflag{m3m0ry\_r3t41ns\_wh4t\_d1sk\_l053s}

---

## Half Awake

Đầu tiên khi đọc giao thức HTTP thì mình phát hiện có hint để giải challenge

```
Giao thức mDNS có gợi ý để giải flag
Nếu payload có header PK thì xuất nó thành file
```
![[utctf2.png]]
Khi mình filter theo giao thức TLS thì tìm thấy gói tin có chứa đoạn payload có header PK nên mình đã xuất nó ra thành file zip  
![[utctf3.png]]
Sau khi giải nén file zip mình thu được chuỗi có format rất giồng flag và có vẽ đang bị mã hóa lúc này mình nghĩ tới gợi ý ban đầu
![[utctf4.png]]
Khi filter theo giao thức mDNS thì mình thấy có gói tin với độ dài khác thường nên đã kiểm tra và tìm được key  
![[utctf5.png]]
Dùng key để xor và lấy flag  
![[utctf6.png]]

> Flag: utflag{h4lf\_aw4k3\_s33\_th3\_pr0t0c0l\_tr1ck}

---

## Last Byte Standing

Vì tên challenge là LBS nên mình kiểm tra bit byte cuối của các gói tin thì tìm thấy ở các gói DNS có dư ra các byte 0 và 1 và có thể tạo thành chuỗi nhị phân  
![[utctf7.png]]
Mình dùng Tshark để trích xuất chuỗi nhị phân này ra  
![[utctf8.png]]
Sau đó ghép 8 bit thành 1 byte ký tự và giải mã  
![[utctf9.png]]

> Flag: utflag{d1g\_t0\_th3\_l4st\_byt3}

---

## Silent Archive

Đầu tiên sau khi giải nén file mình thu được 2 file là 1 và 2, khi giải nén file 1 mình thu được 2 ảnh và sau khi dùng strings lên cả 2 thì phát hiện ra 2 chuỗi base64  
![[utctf10.png]]
Tiếp đén mình giải nén file 2 thì phát hiện bên trong có file 999.tar và sẽ còn nhiều file bên trong kiểu 998.tar, 997.tar,… nên mình dùng lệnh để giải nén hết ra hoặc dùng tool mình có sẵn


```bash
cd f2
name="999.tar"

while true; do
    next=$(tar -tf "$name" | head -n 1)
    tar -xf "$name"
    rm "$name"
    name="$next"
    echo "$name"
    case "$name" in
        *.zip) break;;
    esac
done
```

Sau đó mình thu được file zip và càn mật khẩu để mở và đó là chuỗi base64 decode ban đầu mình tìm được: **0r4ng3\_ArCh1v3\_T4bSp4ce!** sau khi giải nén mình thu được file trống không có gì nhưng rất nhều dòng làm mình nghĩ ngay đến whitespace encode nên mình dùng cyberchef để giải  
![[utctf11.png]]

> Flag: utflag{d1ff\_th3\_tw1ns\_unt4r\_th3\_st0rm\_r34d\_th3\_wh1t3sp4c3}

## Landfall

Challenge chung cấp cho mình 3 file để giải và từ đó mình tìm được hướng đi là tìm lệnh mà attacker dùng để nâng cấp quyền sau đó chuyển nó sang MD5 và dùng nó làm pass để mở file zip

```
how-to-solve.txt: Cách giải
briefing.txt: Mô tả và hint
checkpointA.zip: File chứa flag
```

Và mình tìm được file chứa các lệnh powershell và trong đó có 1 lệnh đánh ngờ  
![[utctf112.png]]
```bash
powershell -nop -e QwA6AFwAVQBzAGUAcgBzAFwAagBvAG4AXABEAG8AdwBuAGwAbwBhAGQAcwBcAG0AaQBtAGkAawBhAHQAegBcAHgANgA0AFwAbQBpAG0AaQBrAGEAdAB6AC4AZQB4AGUAIAAiAHAAcgBpAHYAaQBsAGUAZwBlADoAOgBkAGUAYgB1AGcAIgAgACIAcwBlAGsAdQByAGwAcwBhADoAOgBsAG8AZwBvAG4AcABhAHMAcwB3AG8AcgBkAHMAIgAgACIAZQB4AGkAdAAiAA==
```

Decode base64 để xem chi tiết lệnh thì thấy đây đúng là lệnh cần tìm

```
C:\Users\jon\Downloads\mimikatz\x64\mimikatz.exe "privilege::debug" "sekurlsa::logonpasswords" "exit"
```

Vì thế mình chuyển nó sang MD5  
![[utctf13.png]]
Và dùng nó làm pass để mở file zip lấy flag  
![[utctf14.png]]

> Flag: utflag{4774ck3r5\_h4v3\_m4d3\_l4ndf4ll}

---

## Watson

Theo như gợi ý avf mô tả thì mình cần tìm file doc bị xáo để lấy pass checkpointA nhưng mình dùng John the Ripper để crack thì ra luôn pass và lấy được phần đầu của flag  
![[utctf15.png]]
Còn nếu làm như hint có sẵn thì vào đừng dẫn của thùng rác để tìm lại fiel doc  
![[utctf16.png]]
Tiếp đến để lấy pass cả checkpointB thì mình cần tìm file exe đã được tải xuống và mình cần tìm hive chứa các file trước  
![[utctf17.png]]
Sau đố mình load file vào tool để đọc và mình tìm thấy đường dẫn có 1 file với tên gốc là helloworld.exe nghe có mùi sai sai  
![[utctf18.png]]
Sau khi tìm hiểu thì mình nhận ra file calc.exe nằm ở đây là rất bất thường nên suy ra đây là file cần tìm  
![[utctf19.png]]
Và đề yêu cầu pass là SHA1: `67198a3ca72c49fb263f4a9749b4b79c50510155`  
![[utctf20.png]]
Giải nén và thu được phần còn lại của flag  
![[utctf21.png]]
Sau đó ghép lại thành flag hoàn chỉnh theo format: utflag{DEAD-BEEF}

> Flag: utflag{pr1v473\_3y3-m1551n6\_l1nk}

---

## Sherlockk

Đầu tiên để lấy được pass của checkpointA mình cần phải tìm database chứa dường dẫn tải xuống từ website lưu trữ văn bản  
![[utctf22.png]]
Sau khi đã tìm được database mình kiểm tra thì lấy được đường dẫn và là pass để mở checkpointA  
![[utctf23.png]]
Giải nén và láy flag1  
![[utctf24.png]]

Để tìm file note ghi chú bị xóa mình vào thùng rác để tìm nhưng chỉ có file Notes.txt thiếu mất file Administator Notes.txt nên mình vào $MFT để tìm
![[utctf53.png]]


Và để dẽ dàng thì mình dùng tool in ra csv để tìm cho nhanh  
`analyzeMFT.py -f '$MFT' -o output.csv`

Tiếp đến mình tìm record chứa file này  
![[utctf26.png]]
Mình cần tìm offset của record này trong file nên tính với công thức như sau

```
record * 1024 = offset (Vì mỗi record thường dài khoảng 1024)
160984 * 1024 = 164847616
```

Mình dùng HxD để tìm và đã tìm được nội dung của file cũng như ghi chú để ghép thành pass mở checkpointB và trong file thì từ cuối bị mất chữ mình chỉ thấy arrots nhưng vì đây là ghi chú về các mặt hàng mua sắm nên nghĩ ngay đến từ Carrot
![[utctf27.png]]
Lettuce-Cabbage-Carrots  
Giải nén và lấy flag2  
![[utctf28.png]]

Tìm file dáng ngờ chứa script được tải xuống  
![[utctf29.png]]
Sau đó băm file theo MD5 để lấy pass mở checkpointC  
![[utctf30.png]]
Giải nén và lấy flag3  
![[utctf31.png]]
Sau đó ghép lại thành flag hoàn chỉnh

> Flag: utflaf{b45k3rv1ll3-3l3m3n74ry-4r7hur\_c0n4n\_d0yl3}

---

## Mics

Để cho mình link github nên mình truy cập vào và kiểm tra thì thấy có chuỗi base64  
![[utctf32.png]]
Decode chuỗi mình tìm được link github thứ 2  
![[utctf33.png]]
Truy cập vào link minh được cho link github thứ 3  
![[utctf34.png]]
Tiếp tục truy cập vào thì mình được file python lúc đầu mình nghĩ dùng để giải mã già đó nhưng mình thây phần comment có chuỗi hex đáng nghi  
![[utctf35.png]]
Decode chuỗi thì mình thu được link github thứ 4  
![[utctf36.png]]
Truy cập vào thì mình lấy dược flag nhưng lúc nayflag đã bị mã hóa  
![[utctf37.png]]
Decode với ROT13  
![[utctf38.png]]

> Flag: utflag{f0ll0w1ng\_th3\_cr4wl\_tr41l}

---

## Double Check

Mở lịch sử và xem commit cũ  
![[utctf39.png]]
![[Images/utctf53.png]]

> Flag: utflag{n07h1n6\_70\_h1d3}

---

## Jail Break

Bài này thực ra đọc source thì đã thấy flag mã hóa kèm key  
![[utctf40.png]]
Dùng xor với key để lấy flag  
![[utctf41.png]]

> Flag: utflag{py\_ja1l\_3sc4p3\_m4st3r}

## QRecreate

Ghép lại thnahf QR code

> Flag:

---

## W3W1

Tìm kiếm vói google image thì mình tìm được tên địa điểm này là University Christian Church, Austin  
![[utctf42.png]]
Tiếp đó mình tra với [what3words](https://what3words.com/bench.safety.resemble) và tìm trên các ô  
![[utctf43.png]]
![[utctf44.png]]

> Flag: utflag{floating.offices.splash}

---

## W3W2

Tiếp tục dùng google image và tìm được tên địa điểm  
![[utctf45.png]]
![[utctf46.png]]
![[utctf47.png]]

> Flag: utflag{contemporary.spots.pleased}

---

## W3W3

Mình lật ảnh lại và đọc chữ trên mặt nước để thu thập thêm manh mối và có vẻ chữ đó là **AGUAS DE LIND**  
  ![[utctf48.png]]
Kết hợp manh mối tìm được với google image mình tìm được địa điểm  
![[utctf49.png]]
Tra trên bản đồ thì mình tìm được cái hồ nơi có chữ trong hình  
![[utctf50.png]]
Tìm ở các ô lân cận thì tìm được 3 từ cần tìm  
![[utctf51.png]]

> Flag: utflag{deliverance.herbs.heartiest}

