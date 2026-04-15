author: Azaki
source: https://hackmd.io/@azaki/BJoZdD35ex
published: published
created: 2025-10-30
description:
tags: Challenge


# Forensic
```
Viblo - Forensic challenge
Tiến độ: 9/22
```
<div style="width: 100%; background-color: #f3f3f3; border-radius: 25px;">
  <div style="height: 30px; width: 40%; background-color: #4caf50; border-radius: 25px;"></div>
</div>

## [NetLab Warmup](https://ctf.viblo.asia/puzzles/netlab-warmup-vg104c0hpc7)
:::success
Start with a warmup to help you get acquainted with NetLab

netlab0.zip
:::

Mở file pcap và lọc data  thì mình thấy có chuỗi fomat khá giống flag

![[Pasted image 20260408080256.png]]

Decode theo ROT13

![[Pasted image 20260408080300.png]]

>Flag: Flag{NetLab0_FTP_1s_n0t_s3cUr3333}

---

## [MS Word virus](https://ctf.viblo.asia/puzzles/ms-word-virus-zbqosxnwb4u)
:::success
Be careful with the virus, always think wisely before open files.

MS Word virus.zip
:::

Đầu tiên mình trích xuất file ẩn

![[Pasted image 20260408080338.png]]

Vào thư mục word và tìm file vbaProject.bin đọc ký tự đọc được trong file

![[Pasted image 20260408080343.png]]

>Flag: Flag{b3_c4r3ful_w1th_m4cr0_d0cum3nt}

---

## [Stager](https://ctf.viblo.asia/puzzles/stager-t9ja3zhsbqf)
:::success
Tuấn vừa mới khám phá ra được một kiểu nhắn tin khá độc đáo mà không ai biết, bạn có thể tìm được tin nhắn của Tuấn không. Thật tình cờ tất cả lưu lượng mạng đã được lưu lại.


capture.zip
:::

Mở file pcap và lọc theo DNS

![[Pasted image 20260408080346.png]]

Ghép lại mình được flag
![image|60](https://hackmd.io/_uploads/S1vS0D3cel.png)

>Flag: Flag{ae6032eeeb5cedc1555940983435335b}

---

## [MS Word](https://ctf.viblo.asia/puzzles/ms-word-ecbo3k6lju3)
:::success
Find the secret message. Flag form: Flag{}


EAP.zip
:::

Trích xuất file ẩn và mở file document.xml

![[Pasted image 20260408080403.png]]

Tới đây mình tưởng là có flag rồi nhưng không phải đây chỉ là 1 nữa của flag thôi kéo xuống để tìm phần còn lại

![[Pasted image 20260408080407.png]]

Vậy là mình có toàn bộ flag

>Flag: Flag{h1dd3n_m3ss4g3_c4n_b3_4nywh3r3}

---

## [Stack image](https://ctf.viblo.asia/puzzles/stack-image-titvjcf015z)
:::success
The somethings.png image has been encrypted by key.png. Can you get the flag?

image.zip
:::

Bài này thì khá dễ cho 2 ảnh trong đó ảnh chứa flag bị chồng lên bởi 1 ảnh khác

![[Pasted image 20260408080422.png]]

Mình ghép 2 ảnh lại bằng stegsolve

![[Pasted image 20260408080426.png]]

>Flag: Flag{x0r_w1th_1m4g3_1s_4m4z1ng_fun}

---

## [Wdiguess](https://ctf.viblo.asia/puzzles/wdiguess-rqjsfadoot9)
:::success
Attacker considers this file as treasure, why and what does it contain?

Related Resource: https://www.ired.team/offensive-security/credential-access-and-credential-dumping/dump-credentials-from-lsass-process-without-mimikatz
 
Wdiguess.zip
:::

Mình dùng vol thì được thông báo là không có symbol table và kernel

![[Pasted image 20260408080431.png]]

Dùng lệnh thay thế 
**`pypykatz lsa minidump lsass.DMP`**

![[Pasted image 20260408080435.png]]

>Flag: Flag{Ls4s5_duMp3r_M4st3R}

---
## [RegLab1: Suspected USB](https://ctf.viblo.asia/puzzles/reglab1-suspected-usb-exn4r9kckhk)
:::success
Chúng tôi đang điều tra một vụ vi phạm dữ liệu. Trong thời gian sự cố xảy ra, có một USB lạ đã được cắm vào máy chủ của chúng tôi. Hãy giúp chúng tôi tìm tên phân vùng của USB đó.

Related Resource: Wrap flag in format Flag{...}/Bọc tên USB bạn tìm thấy trong định dạng Flag{...}
 
RegLab1.zip

:::

Tìm theo đường dẫn
```
SOFTWARE\Microsoft\Windows Portable Devices\Devices\WPDBUSENUMROOT#UMB#2&37C186B&0&STORAGE#VOLUME#_??_USBSTOR#DISK&VEN_SANDISK&PROD_CRUZER&REV_1.20#20052243711926307992&0#
```

![[Pasted image 20260408080458.png]]

>Flag: Flag{5usP3cted_USB_d3T3c73d}

---
## [NetLab1: Sharing](https://ctf.viblo.asia/puzzles/netlab1-sharing-7ftcbkfnovy)
:::success
A protocol that looks a bit strange. Do you know how to deal with it?
 
netlab1.zip
:::

Lọc theo data thì mình thấy có đề cập đến giao thức SMB

![[Pasted image 20260408080504.png]]

Lọc theo smb thì mình tìm được 2 gói tin khả nghi
**`smb2.cmd == 5 || smb2.cmd == 8 || smb2.cmd == 9 || smb2.cmd == 6`**

![[Pasted image 20260408080508.png]]

Sau đó mình xuất 2 file ra

![[Pasted image 20260408080511.png]]

Mở file password thì phát hiện trùng với gói data mình đã tìm thấy lúc nãy

![[Pasted image 20260408080515.png]]

Dùng password để mở file còn lại thì mình được file netlab1.db
Sau đó mình mở file .db
Mở bảng table và chọn flag
Ghép lại mình có được flag 

![[Pasted image 20260408080520.png]]
![[Pasted image 20260408080524.png]]

>Flag: Flag{NetLab1_N0w_y0u_kn0w_SMB??}

---

## [SQL Time](https://ctf.viblo.asia/puzzles/sql-time-pkfybuc0zzv)
:::success
Let's be a detective and uncover the secret lied in this pile of log, Gogogo!

sun.log.zip

:::

Mở file thì mình thấy đây là payload SQl để lấy mật khẩu

```python    
import re, datetime as dt
from urllib.parse import unquote

time_re = re.compile(r"\[(\d{2})/(\w{3})/(\d{4}):(\d{2}):(\d{2}):(\d{2}) \+0000\]")
mon = {'Jan':1,'Feb':2,'Mar':3,'Apr':4,'May':5,'Jun':6,'Jul':7,'Aug':8,'Sep':9,'Oct':10,'Nov':11,'Dec':12}
pat = re.compile(r"\),(\d+),1\)\)=([0-9]+),0,3")

def parse_time(line):
    d, m, y, hh, mm, ss = time_re.search(line).groups()
    return dt.datetime(int(y), mon[m], int(d), int(hh), int(mm), int(ss))

entries = []
with open("sun.log", "r", encoding="utf-8", errors="ignore") as f:
    for line in f:
        t = parse_time(line)
        req = line.split('"')[1]            # "GET ... HTTP/1.1"
        _, path, _ = req.split()
        dec = unquote(path)
        m = pat.search(dec)
        if m:
            pos, val = map(int, m.groups())
            entries.append((t, pos, val))

entries.sort(key=lambda x: x[0])
right = {}  # pos -> val
for i in range(len(entries)-1):
    t, pos, val = entries[i]
    t_next = entries[i+1][0]
    if (t_next - t).total_seconds() >= 3:
        right[pos] = val

flag = "".join(chr(right[p]) for p in sorted(right))
print(flag)
```
    

Và mình có flag

![[Pasted image 20260408080530.png]]

>Flag: flag{t1m3_b4s3d_sql_1nj3cti0n_l0g}

---

# Stego
```
Viblo - Stego challenge
Tiến độ: 10/27
```
<div style="width: 100%; background-color: #f3f3f3; border-radius: 25px;">
  <div style="height: 30px; width: 37%; background-color: #4caf50; border-radius: 25px;"></div>
</div>

## [One True Pairing](https://ctf.viblo.asia/puzzles/one-true-pairing-ke0qayye4kp)
:::info
OTP is a couple that other people think matches the best!!
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@Nam Phạm</b> 
</p>

Có 2 ảnh là first và second nên mình nghĩ đễn việc ghép 2 thằng lại với XOR
Mở ảnh xor

![[Pasted image 20260408080548.png]]

>Flag: Flag{Dont_Reuse_Pad_in_OTP}

---

## [Đen - Lối Nhỏ ft. Phương Anh Đào](https://ctf.viblo.asia/puzzles/den-loi-nho-ft-phuong-anh-dao-bgvo65idf2c)
:::info
Các bạn đã cùng chill cùng Đen trong MV mới chưa https://youtu.be/KKc_RMln5UY
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@Viblo CTF</b> 
</p>

Kiểm tra file thì thấy flag

![[Pasted image 20260408080555.png]]

>Flag: Flag{D3nVau_Sh3rl0ck_H0lm3s}

---

## [FM Audio](https://ctf.viblo.asia/puzzles/fm-audio-j3vcwdomgku)
:::info
Tuan has just found a strange sounding file, can you listen to help Tuan?
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@Viblo CTF</b> 
</p>

Thêm layer spectogram

![[Pasted image 20260408080559.png]]

>Flag: Flag{Hidd3n_t3xt_1n_aud1o}

---

## [MasterYi](https://ctf.viblo.asia/puzzles/masteryi-uhnwjhb6vis)
:::info
Master Yi's Alpha Strike is very powerful. Do you believe it?
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@Bquanman</b> 
</p>

Dùng stegsolve thì ra luôn flag

![[Pasted image 20260408080603.png]]

>Flag: Flag{I_h4t3_Tuy3t_k1_Alph4_VIBLO

---

## [Spongebob Spongebob](https://ctf.viblo.asia/puzzles/spongebob-spongebob-f6zdxekrcdy)
:::info
Spongebob is hiding something. Can you find it for me?
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@Viblo CTF</b> 
</p>

Kiểm tra thì đây là file png chuẩn nên mình dùng zsteg để kiểm tra thì thấy có chuỗi base64

![[Pasted image 20260408080611.png]]

Decode chuỗi

![[Pasted image 20260408080615.png]]


>Flag: flag{hidden_text_image_lsb}

---

## [PDF]()
:::info
This seems to be a regular pdf file. But behind it it doesn't seem that way.
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@Viblo CTF</b> 
</p>


Mở file với LibreOffice

![[Pasted image 20260408080620.png]]

>Flag: flag{easy_show_flag_pdf_to_word}


---

## [Man On The Moon](https://ctf.viblo.asia/puzzles/man-on-the-moon-cb3evdtlxhq)
:::info
I just received this transmission, but I don't have the necessary tools. Help!
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@Viblo CTF</b> 
</p>

Nhìn vào miêu tả và tên bài thì mình nghĩ bài này liên quan tới mặt trăng mà nói tới mặt trăng và file wav thì có vẻ liên qua tới việc truyền thông tin từ mặt trăng về trái đất. Mình tìm kiếm từ tài liệu của **Nasa** về việc truyền thông tìn từ mặt trăng về trái đất thì biết được đó là sóng vô tuyến RF (Radio Frequency)

![[Pasted image 20260408080655.png]]

Mình dùng website [SSTV Decoder](https://sstv-decoder.mathieurenaud.fr/) để chuyển đổi từ sóng vô tuyến về hình ảnh thì có được flag

![[Pasted image 20260408080659.png]]

>Flag: Flag{M4k3_50m3_N01S3e3e3}

---

## [PDF File](https://ctf.viblo.asia/puzzles/pdf-file-yv7iwawrj6n)
:::info
My PDF file is corrupt, can you fix it for me?
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@Viblo CTF</b> 
</p>

Check file thì thấy đây chỉ là data chưa nhận diện được là file pdf cộng với miêu tả thì có vẻ file này bị hỏng rồi

![[Pasted image 20260408080705.png]]

Kiểm tra dạng hex thì rõ luôn file này bị hỏng header rồi cụ thể là mất header

![[Pasted image 20260408080709.png]]

Vậy thì dùng HxD để thêm vào thôi

![[Pasted image 20260408080714.png]]

Lưu file và mở lên

![[Pasted image 20260408080717.png]]

>Flag: Flag{ed1t_h3x_h3ad3r_pdf}

---

## [Eat "cơm"](https://ctf.viblo.asia/puzzles/eat-com-g82fgk9vfxl)
:::info
Do you like to eat "cơm"?
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@Viblo CTF</b> 
</p>

Kiểm tra ảnh có dữ liệu giấu không thì phát hiện có file nhúng trong steghide nhưng mình chưa biết pass

![[Pasted image 20260408080721.png]]

Mà không có pass thì mình crack thôi pass là ==superman==

![[Pasted image 20260408080726.png]]

Dùng pass tìm được để lấy file nhúng ra thì được secret.zip tưởng tới đây là ra rồi nhưng không

![[Pasted image 20260408080731.png]]

Cần pass cho file zip này nữa

![[Pasted image 20260408080734.png]]

Dùng john the ripper để crack mật khẩu thì tìm được là ==pictures==

![[Pasted image 20260408080737.png]]

Mở file txt 

![[Pasted image 20260408080742.png]]

>Flag: Flag{H1d3_t3xt_1n_p1ctur3}

---

