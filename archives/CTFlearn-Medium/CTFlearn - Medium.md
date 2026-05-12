author: Azaki
source: https://hackmd.io/@azaki/HyeUjWFwxl
published: published
created: 2025-10-30
description:
tags: Challenge


```
CTFlearn - Medium challenge
Tiến độ: 17/19
```
<div style="width: 100%; background-color: #f3f3f3; border-radius: 25px;">
  <div style="height: 30px; width: 89%; background-color: #4caf50; border-radius: 25px;"></div>
</div>

## [07601](https://ctflearn.com/challenge/97)
:::info
https://mega.nz/#!CXYXBQAK!6eLJSXvAfGnemqWpNbLQtOHBvtkCzA7-zycVjhHPYQQ I think I lost my flag in there. Hopefully, it won't get attacked...
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@alexkato29 </b> 
</p>

Giải nén n+1 file sau đó sử dụng lệnh để dò
`find -type f -exec strings {} + | grep -i "CTF"`

![[ctflearn1-07601.png]]

>Flag: ABCTF{Du$t1nS_D0jo}

---

## [Milk's Best Friend](https://ctflearn.com/challenge/195)
---
:::info
There's nothing I love more than oreos, lions, and winning. https://mega.nz/#!DC5F2KgR!P8UotyST_6n2iW5BS1yYnum8KnU0-2Amw2nq3UoMq0Y Have Fun :)
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@bobbyjives</b> 
</p>

Đầu tiên mình dùng string nhưng thông báo flag không có ở đây nên mình thử tìm có file bị nhúng không 

![[ctflearn1-milk.png]]
![[ctflearn1-milk1.png]]

Khi vào thì mình thấy có file rar và  jpg nên thử tìm trong jpg 
![[ctflearn1-milk2.png]]

Sử dụng strings

![[ctflearn1-milk3.png]]

>Flag: flag{eat_more_oreos}

---

## [A CAPture of a Flag](https://ctflearn.com/challenge/356)
:::info
This isn't what I had in mind, when I asked someone to capture a flag... can you help? You should check out WireShark.
https://mega.nz/#!3WhAWKwR!1T9cw2srN2CeOQWeuCm0ZVXgwk-E2v-TrPsZ4HUQ_f4
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@hazzy</b> 
</p>

Đầu tiên mình dùng strings thì sẽ thấy một sớ khá là dài nhưng cốt lõi là mình tìm được 4 đoạn base64 nhưng chỉ có 1 đoạn là flag

![[ctflearn1-acapture.png]]

>Flag: flag{AFlagInPCAP}

---

## [Up For A Little Challenge?](https://ctflearn.com/challenge/142)
:::info
https://mega.nz/#!LoABFK5K!0sEKbsU3sBUG8zWxpBfD1bQx_JY_MuYEWQvLrFIqWZ0

You Know What To Do ...
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@skycoder</b> 
</p>

Đầu tiên mình đọc file và thấy được flag nhưng đây là flag giả, Tuy nhiên mình chú ý thấy có 2 dòng chứa mật khẩu nên lưu lại xem sao

![[ctflearn1-upfor.png]]

Bên cạnh đó trong file còn có 1 link khác dẫn tới 1  file zip

![[ctflearn1-upfor1.png]]

Khi giải nén mình chú ý thấy có 1 file jpg trong đường dẫn nên sẽ tìm nó

![[ctflearn1-upfor2.png]]

Đây là 1 file ẩn nên cẩn thận không là bỏ sót

![[ctflearn1-upfor3.png]]

Nhưng khi mở lên thì chả thấy gì y như tên file vì thế mình mở thư mục phía dưới

![[ctflearn1-upfor4.png]]

Sau khi mở mình thấy được file zip nên mình sử dụng foremost để kiểm tra có file nhúng không

![[ctflearn1-upfor5.png]]

Mở lên thì mình thấy file jpg nhưng cần mật khẩu để mở

![[ctflearn1-upfor6.png]]

Quay lại các bước đầu mình đã tìm thấy 2 mật khẩu nên mình thử cả 2 thì lại không được

![[ctflearn1-upfor7.png]]

Nhưng nhìn kỹ mình thấy 2 từ cuối bị dính nên thử xóa đi thì vào được

![[ctflearn1-upfor8.png]]

Tới bước này vẫn lừa, flag nằm ở góc dưới

>Flag: flag{hack_complete}

---

## [Digital Camouflage](https://ctflearn.com/challenge/237)
:::info
We need to gain access to some routers. Let's try and see if we can find the password in the captured network data: https://mega.nz/#!XDBDRAQD!4jRcJvAhMkaVaZCOT3z3zkyHre2KHfmkbCN5lYpiEoY Hint 1: It looks like someone logged in with their password earlier. Where would log in data be located in a network capture?<br /> Hint 2: If you think you found the flag, but it doesn't work, consider that the data may be encrypted.

Credit: picoCTF 2017
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@skywalkrs</b> 
</p>


Sử dụng wireshark

![[ctflearn1-digital.png]]

Filter theo giao thức http

![[ctflearn1-digital1.png]]

Follow gói tin

![[ctflearn1-digital2.png]]

Kiểm tra thì không thấy gì nên mình tiếp tục tăng stream để tìm

![[ctflearn1-digital3.png]]

Tới stream 3 thì mình thấy được user và password nhnhưng đang ở dạng bị encode

![[ctflearn1-digital4.png]]

Decode base64

![[ctflearn1-digital5.png]]

>Flag: PApdsjRTae

---

## [The adventures of Boris Ivanov. Part 1.](https://ctflearn.com/challenge/373)
:::info
The KGB agent Boris Ivanov got information about an attempt to sell classified data. He quickly reacted and intercepted the correspondence. Help Boris understand what exactly they were trying to sell. Here is the interception data: https://mega.nz/#!HfAHmKQb!zg6EPqfwes1bBDCjx7-ZFR_0O0-GtGg2Mrn56l5LCkE
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@nomad</b> 
</p>

Sau khi sử dụng lệnh file thì mình biết ảnh này bị chỉnh sửa bởi GIMP

![[ctflearn1-adventure.png]]

Mở ảnh thì mình chú ý phần nhiều điểm ảnh này

![[ctflearn1-adventure1.png]]

Tinh chỉnh đến khi thấy flag

![[Pasted image 20260407030710.png]]
![[ctflearn1-adventure2.png]]

>Flag: flag{d0nt_m3s5_w1th_th3_KGB}

---

## [Exclusive Santa](https://ctflearn.com/challenge/851)
:::info
Dear Santa,
Hey! There are so many toys that I want, but I just don't have the money. I don't care which toy I get as long as it's one or the other, but not both!
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@EdbR</b> 
</p>

Đầu tiên mình tìm xem có file bị nhúng không do đây là 1 file .rar 

![[ctflearn1-santa.png]]

Mình thấy có 2 file ảnh và 1 file rar nên mình sẽ xem file ảnh trước 

![[ctflearn1-santa1.png]]

Và mình phát hiện trong file **==3.png==** chòn có 1 data chèn sau footer 

![[ctflearn1-santa2.png]]
![[ctflearn1-santa3.png]]

Mình thấy file này và file **==1.png==** giống nhau nên ghép lại thử, đầu tiên mình mở file 1.png 
**`java -jar stegslove.jar`**

![[ctflearn1-santa4.png]]

Sau đó là file trên thì được flag nhưng bị ngược

![[ctflearn1-santa5.png]]

Lật ảnh lại
**`convert -flop sloved.bmp newImage`**

![[Pasted image 20260407030804.png]]

![[ctflearn1-santa6.png]]

>Flag: CTFlearn{Santa_1s_C0ming}

---

## [Naughty Cat](https://ctflearn.com/challenge/890)
:::info
I think my cat is hiding something...
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@Negatyw01</b> 
</p>

Đầu tiên ta có ảnh 1 con mèo sau khi dùng exiftool thì mình phát hiện có file bị nhúng sau footer

![[ctflearn1-naughty.png]]

Sau khi dùng binwalk thì mình phát hiện có file mp3

![[ctflearn1-naughty1.png]]

Mình dùng exiftool lên file mp3 thì phát hiện có chứa mật khẩu

![[ctflearn1-naughty2.png]]

Mở file âm thanh và thêm layer spectrogram

![[ctflearn1-naughty3.png]]

Mật khẩu được giấu bên trong

![[ctflearn1-naughty4.png]]

Tiếp đến mình giải nén file .rar nhưng không được

![[ctflearn1-naughty5.png]]

Mình dùng hexdump đểm xem thử thì thấy 4 bit đầu không phải định dạnh của file .rar

![[ctflearn1-naughty6.png]]

Mình dùng hexedit để chỉnh lại 

![[ctflearn1-naughty7.png]]

Và giải nén file

![[ctflearn1-naughty8.png]]

Đọc file thì thấy chuỗi base64

![[ctflearn1-naughty9.png]]

Decode base64

![[ctflearn1-naughty10.png]]

>Flag: f0r3n51cs_ma5t3r

---

## [Smiling ASCII](https://ctflearn.com/challenge/903)
:::info
Find the flag on the smiling face.
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@lvmalware</b> 
</p>

Mình dùng exiftool thì phát hiện có file nhúng sau footer

![[ctflearn1-ascii.png]]

Lấy ra được 2 file

![[ctflearn1-ascii1.png]]

Sau khi dùng strings thì mình thấy được chuỗi base64

![[ctflearn1-ascii2.png]]

Decode basse64

![[ctflearn1-ascii3.png]]

Đoạn này nói gì đó liên quan tới ascii nên mình dùng thử zsteg

![[ctflearn1-ascii4.png]]

Ra luôn flag

>Flag: CTFlearn{ascii_pixel_flag}

---

## [MountainMan](https://ctflearn.com/challenge/888)
:::info
Don't be fooled by two 0xffd9 markers. xor is your friend.
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@kcbowhunter</b> 
</p>

Do có gợi ý nên mình đọc hex

![[ctflearn1-mountain.png]]

Có 2 footer như là miêu tả đã nói mình lấy đoạn giữa 2 footer và đem đi giải mã với xor

![[ctflearn1-mountain1.png]]

Ra flag

>Flag: CTFlearn{Ubuntu_r0ck5}

---

## [HailCaesar!](https://ctflearn.com/challenge/952)
:::info
You might need to write some Python to solve this challenge. Some encryption may be involved. Good Luck!
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@kcbowhunter</b> 
</p>

Mình dùng exiftool thì thấy có 3 fake flag nhưng chứa gợi ý cho cách giải

![[ctflearn1-caesar.png]]

Sau đó mình dùng strings thì thấy rất nhiều thông tin

![[ctflearn1-caesar1.png]]

Decode đoạn base64(bỏ "i" ở đầu) thì được vài lời của tác giả không ảnh hưởng tới bài

![[ctflearn1-caesar2.png]]

Doạn tiếp theo dựa vào gợi ý từ flag giả thì đây có thể là mã Caecar

![[ctflearn1-caesar3.png]]

Tiếp đến là dò flag

![[ctflearn1-caesar4.png]]

Nhưng bị lỗi vài chỗ nên mình thử tìm vài phần của flag

![[ctflearn1-caesar5.png]]

Đối chiếu 2 đoạn và bù vào chỗ lỗi ta có được flag

![[ctflearn1-caesar6.png]]

>Flag: CTFlearn{Maximus.Decimus.Meridius}

---

## [Dumpster](https://ctflearn.com/challenge/355)
:::info
I found a flag, but it was encrypted! Our systems have detected that someone has successfully decrypted this flag, and we stealthily took a heap dump of the program (in Java). Can you recover the flag for me? Here's the source code of the Java program and the heap dump: https://mega.nz/#!rHYGlAQT!48DlH2pSZg10Ei3f-Ivm7RoNBbV16Qw0wN4cWxANUwY
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@thekidofarcrania</b> 
</p>

Mình có file zip nên giải nén được thì các file khác

![[ctflearn1-dumpster.png]]

Mình mở file java ra thì thấy flag bị mã hóa

![[ctflearn1-dumpster1.png]]

Vậy nên mình phải tìm pass để giải mã
Mình chú ý thấy có file .hprof và sau khi tìm hiểu thì biết được đây là file chứa dữ liệu được lưu nên có thể pass nằm trong đây
**`visualvm`**

![[ctflearn1-dumpster2.png]]

Vậy là mình tìm được 16 byte passHash

![[ctflearn1-dumpster3.png]]

Tới đây mình dùng script


```python    
from base64 import b64decode
from Crypto.Cipher import AES

# passHash từ heap dump (đã chuyển byte âm sang unsigned)
passHash = bytes([7, 95, 222, 16, 167, 170, 73, 108, 128, 71, 43, 41, 100, 40, 53, 232])

# FLAG trong code Java
FLAG = "S+kUZtaHEYpFpv2ixuTnqBdORNzsdVJrAxWznyOlJfo="

# Giải mã AES
cipher = AES.new(passHash, AES.MODE_ECB)
pt = cipher.decrypt(b64decode(FLAG))

# Bỏ padding PKCS5/PKCS7
pad_len = pt[-1]
if 1 <= pad_len <= AES.block_size and all(p == pad_len for p in pt[-pad_len:]):
    pt = pt[:-pad_len]

print(pt.decode("utf-8"))
```
    

Sau đó thì chạy script sẽ được flag

![[ctflearn1-dumpster4.png]]

>Flag: CTF{h34p_6ump5_r_c00l!11!!}

---

## [The Keymaker](https://ctflearn.com/challenge/912)
:::info
Jpeg comments can be very interesting.
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@kcbowhunter </b> 
</p>

Đầu tiên đọc file thì mình thấy fake flag, thứ cần chú ý là đoạn comment sau đó

![[ctflearn1-keymaker.png]]

Dùng strings để xem toàn bộ comment

![[ctflearn1-keymaker1.png]]

Decode và mình được hint

![[ctflearn1-keymaker2.png]]

Từ hint mình có được:
1. Lệnh để thực thi
2. S0F0 và SOS

Vậy mình tìm 2 đoạn trên để cho vào lệnh
Mình dùng xxd (hoặc hexpdump đều được nhưng khó nhìn hơn)
S0F0 trong hex là: ffc0 (Bỏ 2 byte đầu vì là byte độ dài)

![[ctflearn1-keymaker3.png]]
SOS trong hex là: ffda (Lấy tới giá trị dưới nó 1 dòng)

![[ctflearn1-keymaker4.png]]

Chạy lệnh để tìm flag
**`openssl enc -d -aes-256-cbc -iv SOF0 -K SOS -in flag.enc -out flag -base64`**

![[ctflearn1-keymaker5.png]]

Và mình có được file flag

![[ctflearn1-keymaker6.png]]

>Flag: CTFlearn{Ne0.TheMatrix}

---

## [ShahOfGimli](https://ctflearn.com/challenge/958)
:::info
That still only counts as one!
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@kcbowhunter</b> 
</p>

Mình dùng strings để xem comment thì thấy 1 đống chữ nhưng dịch ra chủ yếu là lời tác giả và gợi ý

![[ctflearn1-shah.png]]

Dịch **==CTFlearn==** sang sha256sum để có key
**`echo -n | sha256sum`**

![[ctflearn1-shah1.png]]

Gợi ý bảo đoạn mã thứ 3

![[ctflearn1-shah2.png]]

![[ctflearn1-shah3.png]]

Sau đó mình bắt đầu dịch
**`base64 -d cipher.txt > cipher.bin`**
````
openssl enc -d -aes-256-cbc -K <key_hex_SHA256> -iv 00000000000000000000000000000000 -in cipher.bin -out plaintext.txt
````
![[ctflearn1-shah5.png]]

Sau đó mở file plaintext.txt thì mình thấy 3 flag nhưng chỉ là hint
![[ctflearn1-shah6.png]]

Từ hint mình có được
1. Key là sha256sum của file Gimli
2. Hash

Mà mình không thấy file Gimli nên có khả năng nó bị nhúng trong ảnh

![[ctflearn1-shah7.png]]

Giải nén tiếp
![[ctflearn1-shah8.png]]

Và mình có 2 file quan trọng:
1. File flag.enc chứa flag chưa được dịch sang sha256sum
2. File Gimli là key để dịch sang sha256sum

Dịch file Gimli sang sha256 để tìm key

![[ctflearn1-shah9.png]]

Chạy lệnh
**`openssl enc -d -aes-256-cbc -iv 00000000000000000000000000000000 -K SOS -in flag.enc -out flag -nopad`**

![[ctflearn1-shah10.png]]

Đọc file 

![[ctflearn1-shah11.png]]

>Flag: CTFlearn{Gimli.Is.A.Warrior}

---

## [Mr.Bin](https://ctflearn.com/challenge/997)
:::info
Mr.Bin is here to help you,can you find the flag?
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@someone92</b> 
</p>

Mình đọc file thì thấy có đoạn base64

![[ctflearn1-bin.png]]

Decode

![[ctflearn1-bin1.png]]

Và mình được gợi ý
Tiếp đến mình lấy file nhúng thì có được 1 file bin và 1 file zip

![[ctflearn1-bin2.png]]

Để mở file Zip mình cần tìm mật khẩu

![[ctflearn1-bin3.png]]

Sau khi mở thì mình được file

![[ctflearn1-bin4.png]]

Mở lên thì thấy 1 hàng rất dài số 0, lúc này mình nhớ đến hint trước đó nên sẽ chuyển thành 600 dòng x 600 ký tự

![[ctflearn1-bin5.png]]

Lệnh
**`fold -w 600  | head -n 600 > output.txt`**

![[ctflearn1-bin6.png]]

Mở file output.txt ta được flag

![[ctflearn1-bin7.png]]

Hơi khó nhìn tí

>Flag: CTFlearn{y0u_n4il3d_it}

---

## [SpaceStation](https://ctflearn.com/challenge/1045)
:::info
The SpaceStation.jpg contains the encrypted flag in the file flag.enc. The flag is encrypted using openssl and the AES algorithm. The iv and key used for the openssl encryption command are opcodes in an executable named Bangalore that is also hidden in SpaceStation.jpg.
You will need to know just a little bit about crypto, executable file formats and assembler to solve this challenge... objdump is your friend :-)
Needed info is provided in the embedded readme file.
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@kcbowhunter</b> 
</p>

Mình dùng lệnh strings thì thấy có 3 file ẩn trong ảnh

![[ctflearn1-space.png]]

Vậy nên mình lấy file bị nhúng trong ảnh
**`binwalk -e`**

![[ctflearn1-space1.png]]

Tại đây đập vào mắt mình là file **==readme==** nên mình thử mở ra xem sao 

![[ctflearn1-space2.png]]

Trong đây là hint về lệnh cũng như cách lấy ==key== và ==iv== và bài gợi ý là mình dùng ==objdump==
Đầu tiên là ==key== được gợi ý 32 bytes nằm trong label **==_flagLoop==**
**`objdump -d -j .text -M intel ./Bangalore`**

![[ctflearn1-space3.png]]

Tiếp đến là ==iv== được gợi ý 16 bytes nằm trong label **==_Welcome==**
Mà bài này rất lừa vì không có label _Welcome mà chỉ có welcome
**`objdump -d -j .text -M intel ./Bangalore`**

![[ctflearn1-space4.png]]

Tiếp đến mình dùng lệnh có sẵn trong file
**`openssl enc -d -aes-256-cbc -in flag.enc -out flag -iv hexbytes -K hexbytes`**

![[ctflearn1-space5.png]]

Và mở file 

![[ctflearn1-space6.png]]

>Flag: CTFlearn{SpaceX_Is_The_Next_Generation}

---

## [Jakarta](https://ctflearn.com/challenge/980)
:::success
This challenge combines forensics, crypto and programming. A 4096 bit RSA key is used to encrypt the flag and both the encrypted key and the encrypted flag are hidden inside the jpeg. Python scripts are also provided to help decrypt the RSA key which is xor'd with bytes from the jpeg. These same Python scripts can be used as part of solving my 100 point Scope challenge. Good Luck! You may want to solve my MountainMan challenge first if you are having difficulty finding the key and flag hidden in the jpeg.
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@kcbowhunter</b> 
</p>

Link bài bị lỗi không giải đc



---

## [TheVault](https://ctflearn.com/challenge/1025)
:::info
Roses are Red Violets are Blue What is in this Vault Is not meant for you
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@kcbowhunter</b> 
</p>

Dùng strings thì thấy có fake flag kèm gợi ý của tác giả

![[ctflearn1-vault.png]]

Mình dùng binwalk kiểm tra thì thấy có file zip bên trong

![[ctflearn1-vault1.png]]

Nhưng không có mật khẩu để mở + tên file nên mình nghĩ đây không phải là flag mà chỉ là đánh lừa thôi vì bài này khá ít nhười giải nên không thể dễ vậy được

![[ctflearn1-vault2.png]]


Mình thử làm theo tác giả gợi ý về 2 file py, chạy file py1 để tìm EOI gốc

![[ctflearn1-vault3.png]]

Tính tham số
:::spoiler
Start = EOI + 2 = 15125.
length = (filesize - start) + 1
       = (266845 - 15125) + 1
       = 251721

:::

Chạy file py2 với tham số đã tính

![[ctflearn1-vault4.png]]

Tìm flag bị mã hóa bởi ROT như tác giả gợi ý (Hint 1: Tor đọc ngược là ROT)

```python
import re, sys

def rot95_dec(b, n):
    out = bytearray()
    for x in b:
        if 32 <= x <= 126:
            out.append(32 + ((x - 32 - n) % 95))
        else:
            out.append(x)
    return bytes(out)

tail = open("tail.bin","rb").read()
# (tùy chọn) lọc printable để nhanh hơn:
tail = bytes([b for b in tail if 32 <= b <= 126])

for n in range(1,95):
    if n == 47: 
        continue
    dec = rot95_dec(tail, n)
    m = re.search(rb"(CTFlearn\{[^}]{1,300}\})", dec)
    if m:
        print(f"shift = {n} -> {m.group(1).decode(errors='ignore')}")
        break
```


![[ctflearn1-vault5.png]]

>Flag: CTFlearn{Show_Me_The_M0ney}

---

## [Nighthawk](https://ctflearn.com/challenge/981)
:::info
The flag begins with CTFlearn{...
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@kcbowhunter</b> 
</p>


---

