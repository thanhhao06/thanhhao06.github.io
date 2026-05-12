author: Azaki
source: https://hackmd.io/@azaki/rylQYzltlg
published: published
created: 2025-10-30
description:
tags: Challenge

```
PicoCTF - Medium challenge
Tiến độ: 36/48
```
<div style="width: 100%; background-color: #f3f3f3; border-radius: 25px;">
  <div style="height: 30px; width: 75%; background-color: #4caf50; border-radius: 25px;"></div>
</div>

## [Lookey here](https://play.picoctf.org/practice/challenge/279?category=4&difficulty=2&page=2)
:::info
**Description**
Attackers have hidden information in a very large mass of data in the past, maybe they are still doing it.
Download the data here.
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@LT 'syreal' Jones / Mubarak Mikail</b> 
</p>

Dùng strings để tìm flag

![[pico1-lookey.png]]

>Flag: picoCTF{gr3p_15_@w3s0m3_58f5c024}

---

## [Packets Primer](https://play.picoctf.org/practice/challenge/286?category=4&difficulty=2&page=2)
:::info
**Description**
Download the packet capture file and use packet analysis software to find the flag.
Download packet capture
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@LT 'syreal' Jones</b> 
</p>

Dùng wireshark đọc file pcap mở các gói tin thì thấy luôn flag

![[pico1-packet.png]]

>Flag: picoCTF{p4ck37_5h4rk_01b0a0d6}

---

## [Matryoshka doll](https://play.picoctf.org/practice/challenge/129?category=4&difficulty=2&page=3)
:::info
**Description**
Matryoshka dolls are a set of wooden dolls of decreasing size placed one inside another. What's the final one? Image: this
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@Susie/Pandu</b> 
</p>

Bài này thì mình chỉ cần binwalk tới khi ra flag thì thôi kiểu cơ chế giống con búp bê nga

![[pico1-matryoshka.png]]

>Flag: picoCTF{4cf7ac000c3fb0fa96fb92722ffb2a32}

---

## [Wireshark doo dooo do doo...](https://play.picoctf.org/practice/challenge/115?category=4&difficulty=2&page=3)
:::info
**Description**
Can you find the flag? shark1.pcapng.
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@Dylan</b> 
</p>

Bài này giống như bài trên khác cái là flag bị mã hóa ROT13 chỉ chần decode là được

![[pico1-wireshark.png]]

>Flag: picoCTF{p33kab00_1_s33_u_deadbeef}

---

## [Enhance!](https://play.picoctf.org/practice/challenge/265?category=4&difficulty=2&page=3)
:::info
**Description**
Download this image file and find the flag.
Download image file
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@LT 'syreal' Jones</b> 
</p>

Đầu tiên mình dùng grep thì không thấy gì nhưng dùng strings để xem kỹ thì phát hiện flag bị chia nhỏ ra nên grep không tìm được là phải

![[pico1-enhancel.png]]

>Flag picoCTF{3nh4nc3d_d0a757bf}

---

## [tunn3l v1s10n](https://play.picoctf.org/practice/challenge/112?category=4&difficulty=2&page=3)
:::info
**Description**
We found this file. Recover the flag.
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@Danny</b> 
</p>

Dùng identify để kiểm tra thì phát hiện header bị lỗi
**`identify`**

![[pico1-turn.png]]

Dùng exiftool để kiểm tra metadata 

![[pico1-turn1.png]]

Dùng hexedit để chỉnh lại ảnh:
1. Mình nhận thấy file này có độ lớn là 0xD0BA = 53434 bytes trong khi ==InfoHeader== chỉ nên là 40 bytes = 0x28
2. Chỉnh lại chiều dài của ảnh 0x0332 = 818 pixels

![[pico1-turn2.png]]

Tìm được flag

![[pico1-turn3.png]]

>Flag: picoCTF{qu1t3_a_v13w_2020}

---

## [Mob psycho](https://play.picoctf.org/practice/challenge/420?category=4&difficulty=2&page=1)
:::info
**Description**
Can you handle APKs?
Download the android apk here.
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@NGIRIMANA Schadrack</b> 
</p>

Đầu tiên mình giải nén thì được các file và folder mình thử tìm thủ công thì thấy có vô vàng file để xem và việc đó sẽ rất mất thời gian nên mình thử tìm kiếm bằng các từ khóa khả thi

![[pico1-mob.png]]

Mình thử ==flag== thì có 1 file .txt

![[pico1-mob1.png]]

Decode

![[pico1-mob2.png]]

>Flag: picoCTF{axBmC0RU6ve_NX85l4ax8mCl_b112ae57}

---

## [Dear Diary](https://play.picoctf.org/practice/challenge/413?category=4&difficulty=2&page=1)
:::info
**Description**
If you can find the flag on this disk image, we can close the case for good!
Download the disk image here.
::::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@syreal</b> 
</p>

Quăng img lên Autospy rồi tìm từ khóa ==".txt"== sau đó ghép các kí tự lại và mình có được flag

>Flag: picoCTF{1_533_n4m35_80d24b30}

---

## [PcapPoisoning](https://play.picoctf.org/practice/challenge/362?category=4&difficulty=2&page=1)
:::info
**Description**
How about some hide and seek heh?
Download this file and find the flag.
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@Mubarak Mikail</b> 
</p>

Mình thấy có gói tín với kích thước lớn hơn các gói khác nên mở thì phát hiện flag

![[pico1-pcap.png]]

>Flag: picoCTF{P64P__4N4L7S1S_SU55355FUL_fc4e803f}

---

## [MSB](https://play.picoctf.org/practice/challenge/359?category=4&difficulty=2&page=1)
:::info
**Description**
This image passes LSB statistical analysis, but we can't help but think there must be something to the visual artifacts present in this image...
Download the image here
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@LT 'syreal' Jones</b> 
</p>

Dùng công cụ để trích xuất file
**`python sigBits.py --type=Msb `**

![[pico1-msb.png]]

Dùng vi để tìm kiếm flag
Nhấn <kbd>vi</kbd> để mở search.

![[pico1-msb1.png]]

>Flag: picoCTF{15_y0ur_que57_qu1x071c_0r_h3r01c_3a219174}

---

## [hideme](https://play.picoctf.org/practice/challenge/350?category=4&difficulty=2&page=2)
:::info
**Description**
Every file gets a flag.
The SOC analyst saw one image been sent back and forth between two people. They decided to investigate and found out that there was more than what meets the eye here.
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@Geoffrey Njogu</b> 
</p>

Dùng zsteg để kiểm tra do là file PNG thì thấy có file zip ẩn bên trong

![[pico1-hideme.png]]

Tách file zip ra
**`dd if=flag.png of=hidden.zip bs=1 skip=39739 status=none`**

![[pico1-hideme1.png]]
![[pico1-hideme2.png]]

Sau đó mở file zip là có được flag

![[pico1-hideme3.png]]

>Flag: picoCTF{Hiddinng_An_imag3_within_@n_ima9e_82101824}

---

## [FindAndOpen](https://play.picoctf.org/practice/challenge/348?category=4&difficulty=2&page=2)
:::info
**Description**
Someone might have hidden the password in the trace file.
Find the key to unlock this file. This tracefile might be good to analyze.
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@Mubarak Mikail</b> 
</p>

Đầu tiên mở gói tin và lọc các tập tin data
Sau đó mình tìm được các gợi ý trong các tập tin nhưng mình không quan tâm lắm vì gói tin dài 70 bytes sau khi giải mã base64 sẽ có được pass để mở file

![[pico1-find.png]]

Mở file flag đã bị khóa và có được flag

![[pico1-find1.png]]

>Flag: picoCTF{R34DING_LOKd_fil56_succ3ss_0f2afb1a}

---

## [St3g0](https://play.picoctf.org/practice/challenge/305?category=4&difficulty=2&page=2)
:::info
**Description**
Download this image and find the flag.
Download image
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@LT 'syreal' Jones (ft. djrobin17)</b> 
</p>

Dùng zsteg tiếp

![[pico1-stego.png]]

>Flag: picoCTF{7h3r3_15_n0_5p00n_96ae0ac1}

---

## [Sleuthkit Intro](https://play.picoctf.org/practice/challenge/301?category=4&difficulty=2&page=2)
:::info
**Description**
Download the disk image and use mmls on it to find the size of the Linux partition. Connect to the remote checker service to check your answer and get the flag.
Note: if you are using the webshell, download and extract the disk image into /tmp not your home directory.
Download disk image
Additional details will be available after launching your challenge instance.
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@LT 'syreal' Jones</b> 
</p>

Đâu là bài dạng disk forensic
Đầu tiên dùng lệnh mmls để kiểm tra độ dài của Linux như mô tả

![[pico1-sleuthkit.png]]

Mình Lauch instance đển đến gợi ý tiếp theo

![[pico1-sleuthkit1.png]]

Chạy lệnh được gợi ý sau đó nhập độ dài của Linux vừa tìm được
**`nc saturn.picoctf.net 65155`**

![[pico1-sleuthkit2.png]]

>Flag: picoCTF{mml5_f7w!}

---

## [Sleuthkit Apprentice](https://play.picoctf.org/practice/challenge/300?category=4&difficulty=2&page=2)
:::info
**Description**
Download this disk image and find the flag.
Note: if you are using the webshell, download and extract the disk image into /tmp not your home directory.
Download compressed disk image
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@LT 'syreal' Jones</b> 
</p>

Vẫn là disk forensic
Đầu tiên mình giải nén và dùng FTK để tìm kiếm
Mình tìm các mục khả nghi thì thấy mục ==my folder==

![[pico1-sleuthkitapp.png]]

Export file ra và đọc

![[pico1-sleuthkitapp1.png]]

>Flag: picoCTF{by73_5urf3r_3497ae6b}

---

## [Redaction gone wrong](https://play.picoctf.org/practice/challenge/290?category=4&difficulty=2&page=2)
:::info
**Description**
Now you DON’T see me.
This report has some critical data in it, some of which have been redacted correctly, while some were not. Can you find an important key that was not redacted properly?
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@Mubarak Mikail</b> 
</p>

Dùng công cụ mở file pdf và tô đen sẽ ra flag

![[pico1-redaction.png]]
![[pico1-redaction1.png]]

>Flag: picoCTF{C4n_Y0u_S33_m3_fully}

---

## [Operation Orchid](https://play.picoctf.org/practice/challenge/285?category=4&difficulty=2&page=2)
:::info
**Description**
Download this disk image and find the flag.
Note: if you are using the webshell, download and extract the disk image into /tmp not your home directory.
Download compressed disk image
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@LT 'syreal' Jones</b> 
</p>

Đầu tiên mở file bằng FTK và sau khi tìm kiếm thì mình tìm được file flag nhưng đã được mã hóa

![[pico1-operation.png]]

Có vẽ như đây là 1 file bị mã hóa bằng AES vậy mình cần phải tìm được key để giải mã

![[pico1-operation1.png]]

Dùng grep để tìm key thì ra được lệnh mã hóa kèm key

![[pico1-operation2.png]]

Vậy mình chỉ cần giải mã ngược lại là xong
**`openssl aes256 -d -salt -in flag.txt.enc -out flag.txt -k unbreakablepassword1234567`**

![[pico1-operation3.png]]

Mở file

![[pico1-operation4.png]]

>Flag: picoCTF{h4un71ng_p457_1d02081e}

---

## [File types](https://play.picoctf.org/practice/challenge/268?category=4&difficulty=2&page=2)
:::info
**Description**
This file was found among some files marked confidential but my pdf reader cannot read it, maybe yours can.
You can download the file from here.
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@Geoffrey Njogu</b> 
</p>

Kiểm tra file thì phát hiện file này là file shell

![[pico1-file.png]]

Nên mình sẽ đổi tên và chạy lệnh thì chương trình tạo ra file flag

![[pico1-file1.png]]

Kiểm tra file flag thì thấy bị nén

![[pico1-file2.png]]

Vào thư mục giải nén thì thấy có file 64 
Kiểm tra và giải nén tiếp

![[pico1-file3.png]]

Mình thu dược file flag kiểm tra thì thấy bị nén dạng lzip

![[pico1-file4.png]]

Dùng lệnh lzip để giải nén thì thu được file flag.out

![[pico1-file5.png]]

Kiểm tra file mới thì thấy bị nén ở dạng lz4 nên mình sẽ đổi đuôi cho hợp lý

![[pico1-file6.png]]

Giải nén với lz4 và có đưuọc file flag

![[pico1-file7.png]]

Dùng binwalk thì phát hiện file flag dạng lzma nên đổi đuôi tiếp

![[pico1-file8.png]]

Giải nén và thu được file flag tiếp

![[pico1-file9.png]]

Dùng binwalk tiếp

![[pico1-file10.png]]

Mình thấy có file lzo nên giải nén thử nhưng nó có tồn tại rồi là file 0 nên mình kiểm tra 0 thì đây là file lzip nên mình dùng lzip để giải nén thì thu đucợ 0.out

![[pico1-file11.png]]

Dùng binwalk cho 0.out

![[pico1-file12.png]]

Mình kiểm tra thì thấy file vừa tạo là text 

![[pico1-file13.png]]

Đọc file tới đây vẫn chưa có flag vẫn còn bị encode dạng hex

![[pico1-file14.png]]

Dùng Cyberchef đễ decode

![[pico1-file15.png]]

>Flag: picoCTF{f1len@m3_m@n1pul@t10n_f0r_0b2cur17y_79b01c26}

---

## [Eavesdrop](https://play.picoctf.org/practice/challenge/264?category=4&difficulty=2&page=3)
:::info
**Description**
Download this packet capture and find the flag.
Download packet capture
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@LT 'syreal' Jones</b> 
</p>

Đầu tiên mở file .pcap và filter theo data thì mình tìm được dữ liệu của 1 cuộc hội thoại

![[pico1-eavesdrop.png]]

Sau khi tổng hợp được thì nội dung cuộc hội thoại như sau

![[pico1-eavesdrop1.png]]

Vậy mình cần tìm nội dung của ==file.des3== mà trong các gói tin có 1 gói tin không phải nội dung của cuộc trò chuyện nên mình nghĩ nó có thể là nội dung cần giải mã

![[pico1-eavesdrop2.png]]

Sau đó mình đùng lệnh trong cuộc trò chuyện để giải mã
**`openssl des3 -d -salt -in file.des3 -out file.txt -k supersecretpassword123`**

![[pico1-eavesdrop3.png]]
![[pico1-eavesdrop4.png]]

>Flag: picoCTF{nc_73115_411_0ee7267a}

---

## [advanced-potion-making](https://play.picoctf.org/practice/challenge/205?category=4&difficulty=2&page=3)
:::info
**Description**
Ron just found his own copy of advanced potion making, but its been corrupted by some kind of spell. Help him recover it!
Challenge Endpoints
Download advanced-potion-making	advanced-potion-making
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@bigC</b> 
</p>

Đầu tiên mình kiểm tra thì phát hiện đây là file PNG bị hỏng

![[pico1-advanced.png]]

Vậy mình sửa lại thành file PNG hợp lệ

![[pico1-advanced1.png]]

Sau khi sửa xong thì mình được ảnh màu đỏ không có thông tin gì cả 

![[pico1-advanced2.png]]

Nên mình thử dùng stegslove để check xem 
**`java -jar stegslove.jar`**

![[pico1-advanced3.png]]

>Flag: picoCTF{w1z4rdry}

---

## [Milkslap](https://play.picoctf.org/practice/challenge/139?category=4&difficulty=2&page=3)
:::info
**Description**
🥛
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@James Lynch</b> 
</p>

Dùng stegslove sau đó chọn Analyse --> Data extract

![[pico1-milk.png]]

Đây là dạng LBS nên mình sẽ kiểm tra bit cuối của 3 màu

![[pico1-milk2.png]]

---
## [Disk, disk, sleuth! II](https://play.picoctf.org/practice/challenge/137?category=4&difficulty=2&page=3)
:::info
**Description**
All we know is the file with the flag is named `down-at-the-bottom.txt`... Disk image: dds2-alpine.flag.img.gz
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@syreal</b> 
</p>

Giải nén file thì được file img sau đó mở bằng FTK
Tại FTK mình tìm file như mô đã đã nói và trích xuất file

![[pico1-disk.png]]

Mở file và mình có flag

![[pico1-disk1.png]]

>Flag: picoCTF{f0r3ns1c4t0r_n0v1c3_ff27f139}

---

## [MacroHard WeakEdge](https://play.picoctf.org/practice/challenge/130?category=4&difficulty=2&page=3)
:::info
**Description**
I've hidden a flag in this file. Can you find it? Forensics is fun.pptm
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@madStacks</b> 
</p>

Đầu tiên mình dùng exiftool thì thấy có phần bị ẩn

![[pico1-macro.png]]

Nên mình lấy phần binary đó ra
**`exiftool -b -PreviewImage your_file.pptm > preview_image.jpg`**
Nhưng chỉ thu được 1 ảnh bình thường

![[pico1-macro1.png]]

Do .pptx cũng là thuộc dạng file zip nên mình giải nén thử

![[pico1-macro2.png]]

Sau đó mình tìm kiếm các thư mục thì phát hiện file đáng ngờ

![[pico1-macro3.png]]

Mở lên thì mình thấy đây là chuỗi base64

![[pico1-macro4.png]]

Dùng Cyberchef để decodehoặc lệnh echo 

![[pico1-macro5.png]]

>Flag: picoCTF{D1d_u_kn0w_ppts_r_z1p5}

---

## [Disk, disk, sleuth!](https://play.picoctf.org/practice/challenge/113?category=4&difficulty=2&page=3)
:::info
**Description**
Use `srch_strings` from the sleuthkit and some terminal-fu to find a flag in this disk image: dds1-alpine.flag.img.gz
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@syreal</b> 
</p>

Lúc đầu thấy file disk nên tưởng mò bằng FTK nhưng sau khi mò thì không thấy gì cả
Dùng strings mình có luôn flag

![[pico1-diskdisk.png]]

>Flag: picoCTF{f0r3ns1c4t0r_n30phyt3_267e38f6}

---

## [Wireshark twoo twooo two twoo...](https://play.picoctf.org/practice/challenge/110?category=4&difficulty=2&page=3)
:::info
**Description**
Can you find the flag? shark2.pcapng.
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@Dylan</b> 
</p>

Mới đầu lọc các điểm khả nghi thì mình thấy được flag nhưng đây chỉ là flag giả và có rất nhiều flag như này nữa nên mình thử đổi hướng tìm kiếm khác

![[pico1-wiresharktwo.png]]

Sau khi tìm kiếm một hồi thì mình nhận thấy có điểm đáng nghi đó là dns nên mình thử filter theo xem

![[pico1-wiresharktwo1.png]]

Sau khi filter thì ánh mắt mình va phải "=="  đây chính là dấu hiệu của chuỗi base64

![[pico1-wiresharktwo2.png]]

Ghép lại mình được flag

![[pico1-wiresharktwo3.png]]

>Flag: picoCTF{dns_3xf1l_ftw_deadbeef}

---

## [Trivial Flag Transfer Protocol](https://play.picoctf.org/practice/challenge/103?category=4&difficulty=2&page=4)
:::info
**Description**
Figure out how they moved the flag.
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@Danny</b> 
</p>

Mở file pcap và lọc theo data thì mình tìm được gói tin có chứa chuỗi ký tự giải mã qua ROT13 thì mình được câu sau

 ```
 TFTP DOESNT ENCRYPT OUR TRAFFIC SOWE MUSTDIS GUISE OUR FLAG TRANSFER.FIGURE OUT AWAY TO HIDE THE FLAG AND I WILL CHECK BACK FOR THE PLAN
 ```

![[pico1-trivial.png]]

```
I USED THE PROGRAM AND HID IT WITH-DUEDILIGENCE.CHECK OUT THE PHOTOS
```

![[pico1-trivial1.png]]

Từ đây mình biết là có giấu ảnh chứa flag trong gói tin TFTP cùng gợi ý có thể là key (==DUEDILIGENCE==) nên mình sẽ trích xuất ra

![[pico1-trivial2.png]]
![[pico1-trivial3.png]]

Trích xuất file trong ảnh 3
**`steghide extract -sf picture3.bmp -p "DUEDILIGENCE"`**

![[pico1-trivial4.png]]

Mở file flag

![[pico1-trivial5.png]]

>Flag: picoCTF{h1dd3n_1n_pLa1n_51GHT_18375919}

---

## [Pitter, Patter, Platters](https://play.picoctf.org/practice/challenge/87?category=4&difficulty=2&page=4)
:::info
**Description**
'Suspicious' is written all over this disk image.
Additional details will be available after launching your challenge instance.
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@syreal</b> 
</p>

Đầu tin mình có file disk nên là mình mở bằng FTK sau khi tìm kiếm thì mình tìm được 2 file rất đáng chú ý nên extract nó ra

![[pico1-pitter.png]]

File đầu thì bảo là không có gì nên mình mở file tiếp theo

![[pico1-pitter1.png]]

Tại đây mình có flag nhưng bị ngược

![[pico1-pitter2.png]]

>```Flag: picoCTF{b3_5t111_mL|_<3_f2136893}```

---


## [like1000](https://play.picoctf.org/practice/challenge/81?category=4&difficulty=2&page=4)
:::info
**Description**
This .tar file got tarred a lot.
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@Danny</b> 
</p>

Mình giải nén thì được file 999.tar mở tiếp thì sẽ được 998,997,996,.... do có rất nhiều file cần mở nên mình dùng script như trong hint để mở

```python    
import tarfile #Moudle used to work with tar files

for i in range(999, 0, -1): 
	filename = str(i) + '.tar' 
	#print(filename) - just for debug
	tar = tarfile.open(filename) 
	tar.extractall() 
	tar.close() 
```
    

Và mình được 1 file flag.png

![[pico1-like.png]]
![[pico1-like1.png]]

>Flag: picoCTF{l0t5_0f_TAR5}

---

## [What Lies Within](https://play.picoctf.org/practice/challenge/74?category=4&difficulty=2&page=4)
:::info
**Description**
There's something in the building. Can you retrieve the flag?
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@Julio/Danny</b> 
</p>

Dùng zsteg

![[pico1-what.png]]

>Flag: picoCTF{h1d1ng_1n_th3_b1t5}

---

## [extensions](https://play.picoctf.org/practice/challenge/52?category=4&difficulty=2&page=4)
:::info
**Description**
This is a really weird text file TXT? Can you find the flag?
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@Sanjay C/Danny</b> 
</p>

Dùng file thì phát hiện đây không phải file .txt mà là ảnh PNG

![[pico1-extension.png]]

Dùng convert để đổi tên sang PNG

![[pico1-extension1.png]]

Mở file PNG và có được flag

![[pico1-extension2.png]]

>Flag: picoCTF{now_you_know_about_extensions}

---

## [WhitePages](https://play.picoctf.org/practice/challenge/51?category=4&difficulty=2&page=4)
:::info
**Description**
I stopped using YellowPages and moved onto WhitePages... but the page they gave me is all blank!
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@John Hammond</b> 
</p>

Mở file toàn thấy chấm và cách nên đây có thể là mã nhị phân

![[pico1-white.png]]


```python    
def convertSpacesToBinary():
    with open('whitepages.txt', 'rb') as f:
        result = f.read()
    result = result.replace(b'\xe2\x80\x83', b'0')  
    result = result.replace(b'\x20', b'1')  
    result = result.decode()
    return result

def convertFromBinaryToASCII(binaryValues):
    binary_int = int(binaryValues, 2)
    byte_number = (binary_int.bit_length() + 7) // 8
    binary_array = binary_int.to_bytes(byte_number, "big")
    ascii_text = binary_array.decode('ascii')
    print(ascii_text)

convertFromBinaryToASCII(convertSpacesToBinary())
```


Chạy scritp sẽ có được flag

![[pico1-white1.png]]

>Flag: picoCTF{not_all_space_are_created_equal_3e2423081df9adab2a9d96afda4cfad6}

---

## [shark on wire 1](https://play.picoctf.org/practice/challenge/30?category=4&difficulty=2&page=4)
:::info
**Description**
We found this packet capture. Recover the flag.
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@Danny</b> 
</p>

Mở Protocol để xem thì mình thấy mục Microsoft rất đáng nghi với ít gói tin

![[pico1-shark.png]]

Follow và đi đến stream 6

![[pico1-shark1.png]]

>Flag: picoCTF{StaT31355_636f6e6e}

---

## [m00nwalk](https://play.picoctf.org/practice/challenge/26?category=4&difficulty=2&page=4)
:::info
Decode this message from the moon.
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@Joon</b> 
</p>

Do mô tả có đề cập tới mặt trăng kèm file wav nên mình nghĩ đây liên quan tới sóng vô tuyến do đó mình dùng web SSTV Decoder

![[pico1-moonwalk.png]]

Lậy ngược lại là cosd flag

>Flag: picoCTF{beep_boop_im_in_space}

---

## [So Meta](https://play.picoctf.org/practice/challenge/19?category=4&difficulty=2&page=4)
:::info
**Description**
Find the flag in this picture.
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@Kevin Cooper/Danny</b> 
</p>

Dùng exiftool

![[pico1-someta.png]]

>Flag: picoCTF{s0_m3ta_fec06741}
