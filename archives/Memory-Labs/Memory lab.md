---
title: Memory lab

---

# [Lab 0 (Never Too Late Mister)](https://github.com/stuxnet999/MemLabs/tree/master/Lab%200)

My friend John is an "environmental" activist and a humanitarian. He hated the ideology of Thanos from the Avengers: Infinity War. He sucks at programming. He used too many variables while writing any program. One day, John gave me a memory dump and asked me to find out what he was doing while he took the dump. Can you figure it out for me?

Đọc thông tin của image để lấy profile
```bash
python2 vol.py -f ~/Downloads/Challenge.raw imageinfo
```

![[Pasted image 20260415041337.png]]

Tiếp theo mình xem danh sách tiến trình thì thấy cần chú ý 3 chỗ là explorer.exe, cmd.exe và DumpIt.exe
```bash
python2 vol.py -f ~/Downloads/Challenge.raw --profile=Win7SP0x86 pslist
```

![[Pasted image 20260415041351.png]]

Vì vậy mình đọc xem các đường dẫn của các tiến trình này thì thấy tiến trình DumpIt.exe có đường dẫn chứa username
```bash
python2 vol.py -f ~/Downloads/Challenge.raw --profile=Win7SP0x86 cmdline
```

![[Pasted image 20260415041419.png]]

Tiếp đến mình kiểm tra xem các lệnh được thực thi thì thấy có file py đã được chạy với username là hello  cungx chính là username của phần DumpIt.exe
```bash
python2 vol.py -f ~/Downloads/Challenge.raw --profile=Win7SP0x86 cmdscan
```
![[Pasted image 20260415041425.png]]

Xem chi tiết lệnh được chạy trên consoles thì mình thấy được 1 chuỗi có vẻ là hex
```bash
python2 vol.py -f ~/Downloads/Challenge.raw --profile=Win7SP0x86 consoles
```

![[Pasted image 20260415041435.png]]

Nhưng khi decode thì dường như vô nghĩa 

![[Pasted image 20260415041441.png]]

Tới đây mình thấy là mình chưa đụng tới mô tả và có lẽ đây là lúc cần dùng nó
```text
enviromental
Thanos
Infinity War
programming
variables
```
Về từ khóa gợi ý dầu tiên là "enviromental" thì có vẽ như nó đang đề cập tới môi trường của của máy tính và khi chạy lệnh thì tôi bắt gặp "Thanos" cũng chính là từ khóa thứ 2 mà mình đề cập và nó cho mình biết 2 từ khóa mới 
```bash
python2 vol.py -f ~/Downloads/Challenge.raw --profile=Win7SP0x86 envars 
```

![[Pasted image 20260415041502.png]]

```=
XOR
password
```
Mình dùng thử XOR để decode chuỗi hex lúc nãy nhưng mình cần key và mình đã thử 3 từ khóa trước đó nhưng không được

![[Pasted image 20260415041508.png]]

Nhưng mình xem xét lại 3 từ khóa này thì thấy nó gợi ý cái gì đó
"vô tận" + "chương trình" + "biến" --> Brute force và mình tìm được một phần cảu flag tại giá trị Key=2

![[Pasted image 20260415041518.png]]

Với từ khóa "password" thì mình thử tìm mật khẩu được giấu và ở đây có 3 user lần lượt là Admin, Guest và hello mà lúc nãy mình thấy vì vậy có thể password của user này chính là phần còn lại của flag nhưng mình không biết cách crack hash này sang chữ
```bash
python2 vol.py -f ~/Downloads/Challenge.raw --profile=Win7SP0x86 hashdump
```

![[Pasted image 20260415041524.png]]

# [Lab 1 (Beginner's Luck)](https://github.com/stuxnet999/MemLabs/tree/master/Lab%201)

My sister's computer crashed. We were very fortunate to recover this memory dump. Your job is get all her important files from the system. From what we remember, we suddenly saw a black window pop up with some thing being executed. When the crash happened, she was trying to draw something. Thats all we remember from the time of crash.

## First flag
Đầu tiên là đọc thông tin image

![[Pasted image 20260415041535.png]]

Xem danh sách tiến trình thì thấy cmd.exe đang chạy và khá giống hoàn cảnh của Lab 0

![[Pasted image 20260415041554.png]]

Mình xem các lệnh thự thi thì thấy có lệnh "St4G3$1"

![[Pasted image 20260415041600.png]]

Xem nó chạy ra gì trên consoles thì mình thấy nó trả về một chuỗi base64

![[Pasted image 20260415041605.png]]

Decode chuỗi và mình có được flag

![[Pasted image 20260415041612.png]]

>Flag: flag{th1s_1s_th3_1st_st4g3!!}

## Second flag
Tìm không ra nhưng mình nghĩ có khả năng liên quan tới đoạn base64 này

![[Pasted image 20260415041617.png]]

## Third flag
Đọc lịch sử trình duyệt để xem có thông tin nào không thì mình tìm được vài file có vẻ đáng chú ý
```bash
python2 vol.py -f ~/Downloads/MemoryDump_Lab1.raw --profile=Win7SP1x64 iehistory        
```

![[Pasted image 20260415041630.png]]

Tìm thử với file scan thì thấy có thể dump file ra được
```bash
python2 vol.py -f ~/Downloads/MemoryDump_Lab1.raw --profile=Win7SP1x64 filescan | grep "Important"
```
![[Pasted image 20260415041640.png]]

Dump file ra ngoài
```bash
python2 vol.py -f ~/Downloads/MemoryDump_Lab1.raw --profile=Win7SP1x64 dumpfiles -Q 0x000000003fa3ebc0 -D ~/Dơnloads
```

![[Pasted image 20260415041648.png]]

Dùng string thì thấy gợi ý là băm mật khẩu của user Alissa để lấy pass

![[Pasted image 20260415041655.png]]

Dùng lệnh hashdump để lấy hash mật khẩu của user Alissa

![[Pasted image 20260415041704.png]]

Sau đó mình crach cái hash đó để tìm mật khẩu

![[Pasted image 20260415041710.png]]

Băm mật khẩu để lấy pass

![[Pasted image 20260415041717.png]]

Dùng pass mở file và mình được flag

![[Pasted image 20260415041723.png]]

>Flag: flag{w3ll_3rd_stage_was_easy}

# [Lab 2 (A New World)](https://github.com/stuxnet999/MemLabs/tree/master/Lab%202)

One of the clients of our company, lost the access to his system due to an unknown error. He is supposedly a very popular "environmental" activist. As a part of the investigation, he told us that his go to applications are browsers, his password managers etc. We hope that you can dig into this memory dump and find his important stuff and give it back to us.

Note: This challenge is composed of 3 flags.

## First flag

![[Pasted image 20260415041737.png]]

Xem cách lệnh thực thi thì thấy bảo là không có gì

![[Pasted image 20260415041745.png]]

Với từ khóa "enviromental" giống bài trước nên mình dùng tiếp lệnh môi trường thì tìm được chuỗi base64
```bash
python2 vol.py -f ~/Downloads/MemoryDump_Lab2.raw --profile=Win7SP1x64 envars  
```

![[Pasted image 20260415041751.png]]

Decode chuỗi thì được flag số 1

![[Pasted image 20260415041757.png]]

>Flag: flag{w3lc0m3_T0_$T4g3_!_Of_L4B_2}

## Second flag
Mình thử tìm kiếm hoạt động trình duyệt như mô tả đề cập thì thấy có một vài file đáng ngờ
```bash
python2 vol.py -f ~/Downloads/MemoryDump_Lab2.raw --profile=Win7SP1x64 iehistory     
```

![[Pasted image 20260415041803.png]]

![[Pasted image 20260415041807.png]]

Mình tìm file kdbx
```bash
python2 vol.py -f ~/Downloads/MemoryDump_Lab2.raw --profile=Win7SP1x64 filescan | grep "Hidden"
```

![[Pasted image 20260415041815.png]]

Mình dump file ra nhưng file này yêu cầu mậ khẩu để mở
```bash
python2 vol.py -f ~/Downloads/MemoryDump_Lab2.raw --profile=Win7SP1x64 dumpfiles -Q 0x000000003fb112a0 -D ~/Downloads
```

![[Pasted image 20260415041820.png]]

Vậy nên mình tiếp tục với file Password
```
 python2 vol.py -f ~/Downloads/MemoryDump_Lab2.raw --profile=Win7SP1x64 filescan | grep "Password"
```

![[Pasted image 20260415041826.png]]

Dump file và mở ảnh để xem thì thấy có mật khẩu ở góc phải ảnh
```
python2 vol.py -f ~/Downloads/MemoryDump_Lab2.raw --profile=Win7SP1x64 dumpfiles -Q 0x000000003fce1c70 -D ~/Downloads
```

![[Pasted image 20260415041836.png]]

![[Pasted image 20260415041831.png]]

Mở file kdbx với mật khẩu và vào recycle bin để lấy flag

![[Pasted image 20260415041841.png]]

>Flag: flag{w0w_th1s_1s_Th3_SeC0nD_ST4g3_!!}

## Third flag
Tiếp đến là gợi ý về trình duyệt mình kiểm tra kết nối mạng thì có thằng chrome
```bash
python2 vol.py -f ~/Downloads/MemoryDump_Lab2.raw --profile=Win7SP1x64 netscan
```

![[Pasted image 20260415041849.png]]

Vì vậy mình tìm theo thừ khóa "Chrome" thì thấy offset History của nó
```bash
python2 vol.py -f ~/Downloads/MemoryDump_Lab2.raw --profile=Win7SP1x64 filescan | grep "Chrome"
```

![[Pasted image 20260415041854.png]]

Dump file và kiểm tra

![[Pasted image 20260415041900.png]]

Mở file và vào bảng URL thì mình thấy có link dẫn tới META 

![[Pasted image 20260415041905.png]]

Và ở link này có 1 file mình cần phải tải về

![[Pasted image 20260415041910.png]]

Nhưng file này cần mật khẩu và đọc string thì thấy gợi ý lấy mật khẩu là dạng SHA-1 của Third flag của Lab 1

![[Pasted image 20260415041916.png]]

![[Pasted image 20260415041921.png]]

Mở file và lấy flag 

![[Pasted image 20260415041925.png]]

>Flag: flag{ok_So_Now_St4g3_3_í_DoNE!!}


---

# [Lab 3 (The Evil's Den)](https://github.com/stuxnet999/MemLabs/tree/master/Lab%203)

A malicious script encrypted a very secret piece of information I had on my system. Can you recover the information for me please?

Note-1: This challenge is composed of only 1 flag. The flag split into 2 parts.

Note-2: You'll need the first half of the flag to get the second.

---

Kiểm tra danh sách tiến trình thì thấy có 2 phần đáng chú ý là explorer.exe và notepad.exe mình không thấy cmd.exe nên sẽ bỏ qua phần kiểm tra cmd 

![[Pasted image 20260415041952.png]]

Mình tìm lịch sử trình duyệt thì thấy 3 file đáng chú ý là suspision1.jpeg, evilscript.py, vip.txt

![[Pasted image 20260415041957.png]]

Mình dump file suspision1.jpeg ra nhưng không tìm thấy gì cả nên cứ để đây có thể sẽ dùng sau

![[Pasted image 20260415042004.png]]

Có thả năng là ảnh này liên quan tới gợi ý dùng tool steghide mà mô tả đã đề cập

![[Pasted image 20260415042008.png]]

Mình dump tiếp 2 file còn lại

![[Pasted image 20260415042015.png]]

Và có vẻ như đoạn chuỗi trong file vip.txt đã bị xor và encode base64 bằng evilscript.py

```python
import sys
import string

def xor(s):

	a = ''.join(chr(ord(i)^3) for i in s)
	return a


def encoder(x):
	
	return x.encode("base64")


if __name__ == "__main__":

	f = open("C:\\Users\\hello\\Desktop\\vip.txt", "w")

	arr = sys.argv[1]

	arr = encoder(xor(arr))

	f.write(arr)

	f.close()
```


Sau khi chạy code thì thu được
```text
am1gd2V4M20wXGs3b2U=
```

![[Pasted image 20260415042116.png]]

Dùng nữa đầu của flag để lấy nữa flag còn lại từ file ảnh lúc nãy

![[Pasted image 20260415042123.png]]

Và thế là mình có flag hoàn chỉnh

![[Pasted image 20260415042128.png]]

>Flag: inctf{0n3_h4lf_1s_n0t_3n0ugh}


---

# [Lab 4 (Obsession)](https://github.com/stuxnet999/MemLabs/tree/master/Lab%204)

My system was recently compromised. The Hacker stole a lot of information but he also deleted a very important file of mine. I have no idea on how to recover it. The only evidence we have, at this point of time is this memory dump. Please help me.

Note: This challenge is composed of only 1 flag.

The flag format for this lab is: inctf{s0me_l33t_Str1ng}


![[Pasted image 20260415042140.png]]

![[Pasted image 20260415042143.png]]

Mình tìm và dump lần lượt các file ra nhưng file Important.txt dường như không còn tồn tại mặc dù dump thành công

![[Pasted image 20260415042149.png]]

Ảnh đầu thì không có gì đặc biệt lắm nên tạm thời mình bỏ qua

![[Pasted image 20260415042157.png]]

Còn ảnh Screenshot1.png thì là ảnh chụp màng hình của google search nhưng bị cắt 1 nữa và mình có thể thấy 1 đoạn chữ nào đó trên thanh tìm kiếm nhưng do chỉ còn 1 nữa nên mình không thể xem được và có khả năng cao đây chính là flag 

![[Pasted image 20260415042203.png]]

Và sau khi mất cả một buổi sáng để khôi phục ảnh cũng như tìm thêm manh mỗi thì mình mới nhận ra 2 ảnh đó chỉ là trò đùa "Joker" vì nếu flag giấu ở ảnh này thì bài này thiên về Stego nhiều hơn là Memory forensic trong khi bài này phải khó và nhiều yếu tố Memory hơn bài trước do đó mình thử tìm kiếm và khôi phục file Important.txt trước đó

Do file có thể bị xóa nên mình dùng mftparser để xem các bản ghi
```
python2 vol.py -f ~/Downloads/MemoryDump_Lab4.raw --profile=Win7SP1x64 mftparser | grep "Important.txt"
```

![[Pasted image 20260415042212.png]]

Tìm kiếm thì mình tìm thấy được nội dung file Important.txt kèm flag trong đó

![[Pasted image 20260415042216.png]]

>Flag: inctf{1_is_n0t_EQu4l_7o_2_bUt_th1s_d0s3nt_m4ke_s3ns3}


---

# [Lab 5 (Black Tuesday)](https://github.com/stuxnet999/MemLabs/tree/master/Lab%205)

We received this memory dump from our client recently. Someone accessed his system when he was not there and he found some rather strange files being accessed. Find those files and they might be useful. I quote his exact statement,

The names were not readable. They were composed of alphabets and numbers but I wasn't able to make out what exactly it was.

Also, he noticed his most loved application that he always used crashed every time he ran it. Was it a virus?

Note-1: This challenge is composed of 3 flags. If you think 2nd flag is the end, it isn't!! :P

Note-2: There was a small mistake when making this challenge. If you find any string which has the string "L4B_3_D0n3!!" in it, please change it to "L4B_5_D0n3!!" and then proceed.

Note-3: You'll get the stage 2 flag only when you have the stage 1 flag.


## Second flag
Đầu tiên xem danh xách tiến trình thì mình thấy có nhân tố mới là WINRAR vậy nên mình sẽ dành sự chú ý tới các file nén

![[Pasted image 20260415042232.png]]

Do vẫn có exeplorer.exe nên mình vẫn tiếp tục xem lịch sử và mở đầu thì mình thấy 2 file rar khả nghi
```bash
python2 vol.py -f ~/Downloads/MemoryDump_Lab5.raw --profile=Win7SP1x64 --profile=Win7SP1x64 iehistory
```

![[Pasted image 20260415042238.png]]

Nhưng mình chỉ tìm được một nên mình dump file ra và kiểm tra thì thấy có flag 2 ở trong nhưng cần mật khẩu để mở

![[Pasted image 20260415042245.png]]

![[Pasted image 20260415042250.png]]

## First flag
Vì vậy mình quay lại phần lịch sử trình duyệt và tìm tiếp xem có file mật khẩu không thì mình tìm thấy file có vẻ như là đang chứa mật khẩu nhưng khi tìm bằng filescan thì không tìm thấy nên chắc đây chì là lừa thôi cả 2 file còn lại cũng tương tự

![[Pasted image 20260415042255.png]]

Mình tiếp tục tìm kiếm và như 1 thói quen mình hay decode mọi đoạn base64 mình thấy được dù cho nó là vô nghĩa thì lần này mình lại vô tình tìm được flag

![[Pasted image 20260415042302.png]]

![[Pasted image 20260415042313.png]]

>Flag: flag{!!_w3LL_d0n3_St4g3-1_0f_L4B_5_D0n3_!!}

Vậy là mình có được flag 1 Và có thể dùng nó để mở flag 2 như mô tả

![[Pasted image 20260415042324.png]]

>Flag: flag{W1th_th1s_$tage_2_1s_c0mPL3t3_!!}

## Third flag
Vậy là đã có 2 flag và ảnh flag 2 bảo đây là flag cuỗi nhưng trong mô tả lại nói bài này có tới 3 flag và mình nhới rằng trong danh sách tiến trình còn 1 thằng mình chưa đụng nữa là NOTEPAD.exe

![[Pasted image 20260415042340.png]]

Và khi dump ra thì mình được 3 file và kiểm tra lần lượt tụi nó

![[Pasted image 20260415042345.png]]

Tại file NOTEPAD.EXE số 2 thì mình tìm được các kí tự đơn lẻ của flag và điều này khá may mắn khi mình đã định bỏ cuộc khi mất rất nhiều thời gian tìm kiếm ở file NOTEPAD.EXE số 1 mà không tìm thấy gì

![[Pasted image 20260415042353.png]]

>Flag: bi0s{M3m_l4b5_OVeR_!}

# [Lab 6 (The Reckoning)](https://github.com/stuxnet999/MemLabs/tree/master/Lab%206)

We received this memory dump from the Intelligence Bureau Department. They say this evidence might hold some secrets of the underworld gangster David Benjamin. This memory dump was taken from one of his workers whom the FBI busted earlier this week. Your job is to go through the memory dump and see if you can figure something out. FBI also says that David communicated with his workers via the internet so that might be a good place to start.

Note: This challenge is composed of 1 flag split into 2 parts.

The flag format for this lab is: inctf{s0me_l33t_Str1ng}


Đầu tiên đọc danh sách tiến trình thì mình thấy có WINRAR.EXE giống như lab 5

![[Pasted image 20260415042404.png]]

Kiểm tra lịch sử trình duyệt thì thấy có file flag.rar nên mình dump file ra

![[Pasted image 20260415042409.png]]

![[Pasted image 20260415042413.png]]

File đã dump ra nhưng vẫn cần mật khẩu để mở vì thế mình tiếp tục tìm

![[Pasted image 20260415042419.png]]

Do cần mật khẩu nên mình tử tìm mật khẩu người dùng xem vì có khả năng trùng mật khẩu với file RAR

![[Pasted image 20260415042426.png]]

Sau đó mình crack hash nhưng đây không phải là mật khẩu của RAR

![[Pasted image 20260415042430.png]]

Kiểm tra các biến môi trường mình tìm được trường mật khẩu RAR

![[Pasted image 20260415042435.png]]

![[Pasted image 20260415042441.png]]
