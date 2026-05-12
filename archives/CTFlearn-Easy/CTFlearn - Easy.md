author: Azaki
source: https://hackmd.io/@azaki/HJnh8ovvgg
published: published
created: 2025-10-30
description:
tags:


```
CTFlearn - Easy challenge
Tiến độ: 19/19
```
<div style="width: 100%; background-color: #f3f3f3; border-radius: 25px;">
  <div style="height: 30px; width: 100%; background-color: #4caf50; border-radius: 25px;"></div>
</div>

## [Forensics 101](https://ctflearn.com/challenge/96)

>[!info] 
>Think the flag is somewhere in there. Would you help me find it? https://mega.nz/#!OHohCbTa!wbg60PARf4u6E6juuvK9-aDRe_bgEL937VO01EImM7c

<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@intelagent </b> 
</p>

Sử dụng strings để tìm ký tự trong file

![[ctflearn-forensic101.png]]

>Flag: flag{wow_data_is_cool}

---

## [Taking LS](https://ctflearn.com/challenge/103)

>[!info] 
>Just take the Ls. Check out this zip file and I be the flag will remain hidden. https://mega.nz/#!mCgBjZgB!_FtmAm8s_mpsHr7KWv8GYUzhbThNn0I8cHMBi4fJQp8

<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@alexkato29 </b> 
</p>

Đầu tiên giải nén file

![[ctflearn-takingls.png]]

Mình thấy có file **==ThePassword.txt==** nên sẽ tìm xem thử

![[ctflearn-takingls1.png]]

Nhưng khi vào thì mình chỉ thấy có 1 file PDF yêu cầu mật khẩu nên có thể file **==ThePassword.txt==** đã bị ẩn

![[ctflearn-takingls2.png]]

Mở file mình thấy được mật khẩu

![[ctflearn-takingls3.png]]

Nhập mật khẩu vào 

![[ctflearn-takingls4.png]]

![[ctflearn-takingls5.png]]

Vậy là có flag

>Flag: ABCTF{T3Rm1n4l_is_C00l}

---

## [Binwalk](https://ctflearn.com/challenge/108)

>[!info] 
>Here is a file with another file hidden inside it. Can you extract it? https://mega.nz/#!qbpUTYiK!-deNdQJxsQS8bTSMxeUOtpEclCI-zpK7tbJiKV0tXYY

<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@alexkato29 </b> 
</p>

Đầu tiên mình kiểm tra xem đây là loại file gì
**`file`**

![[ctflearn-binwalk.png]]

Tiếp theo là kiểm tra Metadata

![[ctflearn-binwalk1.png]]

Mính thấy thông báo có 1 file PNG ẩn ở cuối

Vậy nên mình thử giải nén

![[ctflearn-binwalk2.png]]

Nhưng khi thử nhiều cách thì có lẽ đây chỉ là file bình thường nên mình thử cách giải nén khác
**`foremost -i`**

![[ctflearn-binwalk3.png]]
![[ctflearn-binwalk4.png]]

Mở file và ta có được flag 

![[ctflearn-binwalk5.png]]

>Flag: ABCTF{b1nw4lk_is_us3ful}

---

## [WOW.... So Meta](https://ctflearn.com/challenge/348)

>[!info]
This photo was taken by our target. See what you can find out about him from it. https://mega.nz/#!ifA2QAwQ!WF-S-MtWHugj8lx1QanGG7V91R-S1ng7dDRSV25iFbk

<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@3301_ </b> 
</p>

Đầu tiêm mình xem loại file

![[ctflearn-someta.png]]

Mình xem thử phần Metadata

![[ctflearn-someta1.png]]

Ra luôn Flag

>Flag: flag{EEe_x_I_FFf}

---

## [Exif](https://ctflearn.com/challenge/303)

>[!info]
If only the password were in the image?
https://mega.nz/#!SDpF0aYC!fkkhBJuBBtBKGsLTDiF2NuLihP2WRd97Iynd3PhWqRw You could really ‘own’ it with exif.

<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@pipetogrep </b> 
</p>

Dùng công cụ exiftool

![[ctrlearn-exif.png]]

>Flag: flag{3l1t3_3x1f_4uth0r1ty_dud3bro}

---
## [Rubber Duck](https://ctflearn.com/challenge/933)

>[!info]
Find the flag! Simple forensics challenge to get started with.

<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@kcbowhunter  </b> 
</p>

Vừa mở file đã gặp flag

![[ctflearn-rubberduck.png]]

>Flag: CTFlearn{ILoveJakarta}

---

## [Git Is Good](https://ctflearn.com/challenge/104)

>[!info]
The flag used to be there. But then I redacted it. Good Luck. https://mega.nz/#!3CwDFZpJ!Jjr55hfJQJ5-jspnyrnVtqBkMHGJrd6Nn_QqM7iXEuc

<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@intelagent   </b> 
</p>

Đầu tiên mình thấy đây là 1 file zip

![[ctflearn-gitisgood.png]]

Kiểm tra Metadata

![[ctflearn-gitisgood1.png]]

Sau đó mình giải nén file zip

![[ctflearn-gitisgood2.png]]

Mình được 1 file

![[ctflearn-gitisgood3.png]]

Thử mở nó thì thấy trong đó còn có 1 file flag.txt

![[ctflearn-gitisgood4.png]]

Mình mở ra được flag nhưng đã bị giấu

![[ctflearn-gitisgood5.png]]

Sử dụng **==git==** để đọc log
**`git log --`**

![[ctflearn-gitisgood6.png]]

Đọc từng commit để tìm flag

![[ctflearn-gitisgood7.png]]

>Flag: flag{protect_your_git}

---

## [I'm a dump](https://ctflearn.com/challenge/883)

>[!info]
The keyword is hexadecimal, and removing an useless H.E.H.U.H.E. from the flag. The flag is in the format CTFlearn{*}

<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@lancillotto   </b> 
</p>

Đầu tiên mình đọc file

![[ctflearn-imdump.png]]

Do có gợi ý nên mình đọc hex của file
**`hexdump -C | less`**

![[ctflearn-imdump1.png]]

Hoặc sử dụng string
**`strings`**

![[ctflearn-imdump2.png]]

>Flag: CTFlearn{fl4ggyfl4g}

---

## [Snowboard](https://ctflearn.com/challenge/934)

>[!info]
Find the flag in the jpeg file. Good Luck!

<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@kcbowhunter</b> 
</p>

Đầu tiên mình xem loại file thì thấy flag nhưng là giả

![[ctflearn-snowboard.png]]

Sau đó mình thử rất nhiều cách nhưng vẫn là fake flag nhưng sau khi tham khảo thì mình biết flag ở dạng base 64 mà sau fake flag cũng có đoạn base 64 nên mình thử xem
**`echo "" | base64 -d`**

![[ctflearn-snowboard1.png]]

Vậy là ra flag

>Flag: CTFlearn{SkiBanff}

---

## [PikesPeak](https://ctflearn.com/challenge/935)

>[!info]
Pay attention to those strings!

<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@kcbowhunter</b> 
</p>

Bài trước thì fake flag còn bài này thì quá trời flag luôn

![[ctflearn-pikespeak.png]]

Mà do bài này có fomat flag sẵn nên ta dùng string để tìm cho dễ
**`strings | grep "CTFlearn"`**

![[ctflearn-pikespeak1.png]]

>Flag: CTFlearn{Gandalf}

---

## [Chalkboard](https://ctflearn.com/challenge/972)

>[!info]
Solve the equations embedded in the jpeg to find the flag. Solve this problem before solving my Scope challenge which is worth 100 points.

<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@kcbowhunter</b> 
</p>

Đọc file mình thấu có dòng form 

![[ctflearn-chalkboard.png]]

Đọc Metadata

![[ctflearn-chalkboard1.png]]

3x+5y=31    => x=2
7x+9y=59    => y=5

>Flag: CTFlearn{I_Like_Math_2_5}

---

## [Tux!](https://ctflearn.com/challenge/973)

>[!info]
The flag is hidden inside the Penguin! Solve this challenge before solving my 100 point Scope challenge which uses similar techniques as this one.

<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@kcbowhunter</b> 
</p>


Đọc file thì mình thấy dòng base64 đáng ngờ nên decode thử thì ra mật khẩu nhưng chưa biết của file nào nên mình để dó
**`echo "" | base64 -d`**

![[ctflearn-tux.png]]

Tiếp đến mình dùng lệnh string thì thấy có dòng flag

![[ctflearn-tux1.png]]

Lấy file bị nhúng trong ảnh 
**`binwalk -e`** hoặc **`foremost -i`**

![[ctflearn-tux2.png]]
![[ctflearn-tux3.png]]

Sau đó mình vào folder để xem thì thấy được 3 file 
![[ctflearn-tux4.png]]

2 file kia thì không có gì nên mình thử file zip thì thấy có thể chứa flag và có thêm 1 file zip trong đó
**`exiftool`** 

![[ctflearn-tux5.png]]

Mình giải nén file zip và sử dụng mật khẩu lúc đầu thì được 2 file
**`unzip`**

![[ctflearn-tux6.png]]

Đọc file flag sẽ ra flag
**`cat`**

![[ctflearn-tux7.png]]

>Flag: CTFlearn{Linux_Is_Awesome}

---

## [Pho Is Tasty!](https://ctflearn.com/challenge/971)

>[!info]
The flag is hidden in the jpeg file. Good Luck! Have some Pho! Solve this challenge before solving my Scope challenge for 100 points.

<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@kcbowhunter</b> 
</p>


Sau khi thử các lệnh mà chả thấy gì nên mình thử tìm xem có file nào bị nhúng bên trong không 
**`foremost -i`**

![[ctflearn-pho.png]]

Truy suất vào trong 

![[ctflearn-pho2.png]]

Mình thử hexdump mà không được nên chuyển ra xxd
**`xxd`** hoặc **`xxd -l <số byte>`**

![[ctflearn-pho1.png]]

Vậy là có được flag

>Flag: CTFlearn{I_Love_Pho!!!}

---

## [Simple Steganography](https://ctflearn.com/challenge/894)

>[!info]
Think the flag is somewhere in there. Would you help me find it? hint-" Steghide Might be Helpfull"

<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@emiwaydodo</b> 
</p>


Đầu tiên đọc Metadata của file, mình tưởng dãy trên là flag nhưng sau khi decode thì không có gì cả nên chỉ có thể sử dụng keywords **==myadmin==**

![[ctflearn-stego.png]]

Do có gợi ý sử dụng steghide nên mình dùng và nhập keywords phía trên thì được file **==raw.txt==**
**`steghide extract -sf`**

![[ctflearn-stego1.png]]

Đọc file **==raw.txt==**
**`cat `**

![[ctflearn-stego2.png]]
![[ctflearn-stego3.png]]

Decode sang base64 là ra flag

![[ctflearn-stego4.png]]

>Flag: CTFlearn{this_is_fun}

---

## [PDF by fdpumyp](https://ctflearn.com/challenge/957)

>[!info]
Hi, just as we talked during a break, you have this file here and check if something is wrong with it. That's the only thing we found strange with this suspect, I hope there will be a password for his external drive
Bye

<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@K1K9</b> 
</p>

Đầu tiên đọc file và Metadata thì khoong thấy gì cả

![[ctflearn-pdf.png]]

Đọc xem có text ẩn nào không
**`strings`**

![[ctflearn-pdf1.png]]

Mình thấy có 2 đoạn base64 nên decode thử

![[ctflearn-pdf2.png]]

Vậy là ra flag cùng với password
>Flag: CTFlearn{)_1l0w3y0Um00My123}

---

## [Minions](https://ctflearn.com/challenge/955)

>[!info]
Hey! Minions have stolen my flag, encoded it few times in one cipher, and then hidden it somewhere there: https://mega.nz/file/1UBViYgD#kjKISs9pUB4E-1d79166FeX3TiY5VQcHJ_GrcMbaLhg Can you help me? TIP: Decode the flag until you got a sentence.

<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@TedZak</b> 
</p>

Kiểm tra Metadata thì thấy có 1 ảnh PNG ẩn trong file

![[ctflearn-minion.png]]

Đọc các ký tự trong file và mình tìm được 1 link ảnh
**`strings`**

![[ctflearn-minion1.png]]
![[ctflearn-minion2.png]]

Khai thác ảnh vừa tải, đoc Metadata thì mình chả thấy gì nên dùng string thử
**`strings`**

![[ctflearn-minion3.png]]

Vậy là trong đây có 1 file được nhúng ở trong nữa nên mình lấy nó ra
**`binwalk -e`**

![[ctflearn-minion4.png]]

![[ctflearn-minion5.png]]

Sử dụng string tiếp thì thấy flag nhưng vẫn đang bị mã hóa
**`strings`**

![[ctflearn-minion6.png]]

Decode
**`echo "" | base64 -d`**

![[ctflearn-minion7.png]]

Decode n+1
**`echo "" | base64 -d`**

![[ctflearn-minion8.png]]

>Flag: CTF{M1NI0NS_ARE_C00L}

---

## [GandalfTheWise](https://ctflearn.com/challenge/936)

>[!info]
Extract the flag from the Gandalf.jpg file. You may need to write a quick script to solve this.

<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@kcbowhunter</b> 
</p>

Đọc file thì thấy có flag nhưng đây là fake flag

![[ctflearn-gandal.png]]

Và mình thấy có 2 đoạn lệnh khác nên sử dụng [CyberChef](https://cyberchef.org/) để decode 

![[ctflearn-gandal1.png]]

Bài này khoai phết do lần đầu làm dạng này

>Flag: CTFlearn{Gandalf.BilboBaggins}

---

## [Blank Page](https://ctflearn.com/challenge/959)

>[!info]
I've just graduated the Super Agent School. This is my first day as a spy. The Master-Mind sent me the secret message, but I don't remember how to read this. Help!

<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@Haker</b> 
</p>

Đầu tiên thử thì chả thấy ghì nhưng khi dịch sang hex thì thấy ký tự toàn là "chấm" và "cách" nên có thể suy theo 2 hướng là **==mã nhị phân==** hoặc **==mã morse==** nhưng đây là bài CTF nên mình ưu tiên nhị phân

![[ctflearn-blank.png]]

Sau đó mình chuyển "chấm" thành 1 và "cách" thành 0


```bash   
xxd -p TheMessage.txt | tr -d '\n' > hexraw.txt


sed 's/20/\n20\n/g; s/e2808f/\ne2808f\n/g' hexraw.txt | grep -E '20|e2808f' > encoded.txt


cat encoded.txt | while read line; do
  if [[ "$line" == "20" ]]; then
    echo -n 0
  else
    echo -n 1
  fi
done > bits.txt
```

![[ctflearn-blank1.png]]

Tiếp đến là in ra

````bash
cat bits.txt | fold -w8 | while read byte; do
  printf "\\x%02x" "$((2#$byte))"
done; echo
````

![[ctflearn-blank2.png]]

Rồi chuyển về dạng chữ

![[ctflearn-blank3.png]]

Vậy là có flag nhưng flag lại thiếu **==}==**, chỉ cần thê vào là xong

>Flag: CTFlearn{If_y0u_r3/\d_thi5_you_pa553d}

---

## [abandoned place](https://ctflearn.com/challenge/1000)

>[!info]
the flag is outside of the pic, try to find it. another hint: dimensions, dimensions, everything is in dimensions.

<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@fakeprofile</b> 
</p>

Lúc đầu tìm kiếm sơ bộ thì mình không thấy có gì bất thường trong ảnh này nhưng mô tả có đề cập về kích thước và cái gì đó bên ngoài bức ảnh có thể là flag vì thế nên mình kiểm tra kích thước của ảnh 

![[ctflearn-abandon.png]]

Tìm kiếm vị trí của phần kích thước
* 2016 = 07 e0
* 900 = 03 84

![[ctflearn-abandon1.png]]

Dùng hexedit để sửa kích thước mà ảnh này là hinh chữ nhật ngang nên mình sẽ tăng kích thước chiều cao của ảnh, đổi thành nhiêu cũng được nhưng để không tốn thời gian thì mình dùng luôn kích thước của chiều rộng để ảnh thành hình vuôn luôn

![[ctflearn-abandon2.png]]

Và tada mình đã có được flag

![[ctflearn-abandon3.png]]

>Flag: urban_exploration
