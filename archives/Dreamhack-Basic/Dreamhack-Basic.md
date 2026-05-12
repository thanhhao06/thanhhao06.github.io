author: Azaki
source: https://hackmd.io/@azaki/SJE59T7Oxg
published: published
created: 2026-01-14
description:
tags: Challenge


```
Dreamhack - Easy challenge
Tiến độ: 24/33
```
<div style="width: 100%; background-color: #f3f3f3; border-radius: 25px;">
  <div style="height: 30px; width: 73%; background-color: #4caf50; border-radius: 25px;"></div>
</div>

# Level 1


## [Hidden](https://dreamhack.io/wargame/challenges/2151)
:::info
Description
The image looks mediocre but there seems to be something hidden
flag format DH{...}
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@luna1</b> 
</p>

Dùng zsteg để phân tích ảnh png

![[Pasted image 20260409103313.png]]

Mình phát hiện có zlib data trong ảnh
Trích xuất zlib ra thành file
```bash
zsteg -E b1,rgb,lsb,xy flag.png > payload.zlib
```

![[Pasted image 20260409103327.png]]

Giải nén file zlib
```bash
zlib-flate -uncompress < payload.zlib > blob.b64
ruby -rzlib -e 'STDOUT.write Zlib::Inflate.inflate(STDIN.read)' < payload.zlib > blob.b64
```

![[Pasted image 20260409103331.png]]

![[Pasted image 20260409103337.png]]

In chuỗi ra thành mã base64
```bash
base64 -d blob.b64 > xored.bin
```

![[Pasted image 20260409103344.png]]

Giải mã theo XOR và in ra file txt
```bash
perl -pe 's/(.)/chr(ord($1)^0x55)/ge' xored.bin > flag.txt
```

![[Pasted image 20260409103347.png]]

Đọc flag

![[Pasted image 20260409103350.png]]

>Flag: DH{Sup3r_Dupe3r_H0td0g}

---

## [half image](https://dreamhack.io/wargame/challenges/2145)
:::info
Description
For some reason a flag image was cut in half Can you find the reason and get the flag?
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@luna1</b> 
</p>

Mình có file nữa flag và 1 file python về các tạo ra nữa flag đó

![[Pasted image 20260409103358.png]]

Dùng zsteg thì minhg phát hiện có phần thồng tin phía sau IEND

![[Pasted image 20260409103402.png]]

Tìm vị trí của IEND
```bash
OFF=$(grep -aob "IEND" flag.png | tail -1 | cut -d: -f1)
echo "$OFF"
```

![[Pasted image 20260409103404.png]]

Bở qua IEND để lấy phần dữ liệu dư
```bash
SKIP=$((16992+8))
dd if=flag.png of=right.rgb bs=1 skip="$SKIP" status=none
```

![[Pasted image 20260409103411.png]]

Tìm kích thước của file flag

![[Pasted image 20260409103418.png]]

Cắt đúng số byte cần thiết
```bash
LEN=$((708*672*3))
head -c "$LEN" right.rgb > right_trim.rgb && mv right_trim.rgb right.rgb
```

![[Pasted image 20260409103421.png]]

Tạo lại thành ảnh
```bash
convert -size ${W}x${H} -depth 8 rgb:right.rgb right.png
```

![[Pasted image 20260409103425.png]]

Vậy là mình có được nữa ảnh còn lại

![[Pasted image 20260409103429.png]]

Tiếp theo mình ghép 2 ảnh lại
```bash
convert +append flag.png right.png full_flag.png
```

![[Pasted image 20260409103433.png]]

![[Pasted image 20260409103436.png]]

>Flag: DH{H0w_T0_Get_F1ags?!}

---


## [Steg-Pack](https://dreamhack.io/wargame/challenges/1676)
:::info
Description
Avoid the fake flags and find the real ones! @
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@DosaX</b> 
</p>

Giải nén file zip mình nhận được file flag.png nhưng chỉ là fake flag

![[Pasted image 20260409103445.png]]

Mình sử dụng exiftool thì thấy có file ẩn

![[Pasted image 20260409103449.png]]

Lấy file ẩn ra ta được một mớ thư mục nhưng ta chỉ cần chú ý thư mục picture

![[Pasted image 20260409103453.png]]

vào thư mục picture

![[Pasted image 20260409103457.png]]

Và mình có được flag 

![[Pasted image 20260409103501.png]]

>Flag: DH{Picture_iN_fl@g?}

---

## [ascetic_zip](https://dreamhack.io/wargame/challenges/1673)
:::info
Description
There was a major collision between the JPG file and the firefly after an accident.
Find the point of collision and submit a flag.
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@DosaX</b> 
</p>

Bài này cũng khá dễ đầu tiên mình dùng strings thì phát hiện có file flag.txt bên trong 

![[Pasted image 20260409103506.png]]

Nên mình dùng binwalk để trích file zip ra

![[Pasted image 20260409103510.png]]

Mình giải nến nhưng file yêu cầu mật khẩu

Mình sẽ crack mật khẩy bằng ==John the Ripper==
```bash
zip2john 1201.zip > zip.hash
john --wordlist=/usr/share/wordlists/rockyou.txt zip.hash
```

![[Pasted image 20260409103514.png]]

Vậy mật khẩu trùng với tên bài
Giải nén  với mật khẩu mình được

![[Pasted image 20260409103518.png]]

>Flag: `DH{My_n@me_h@#NAMM}`

---

## [Audio Steganography](https://dreamhack.io/wargame/challenges/1660)
:::info
Description
WAV files make strange noises!

flag format: DH {}
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@l_daemyeong</b> 
</p>

Giải nén file zip sau thì mình nhận được 1 file âm thanh 
Mở file và thêm layer 

![[Pasted image 20260409103523.png]]
![[Pasted image 20260409103528.png]]

>Flag: DH{He11o_H1dden_Message}

---

## [Don't Do(S) That!](https://dreamhack.io/wargame/challenges/1696)
:::info
Description
Dream is searching the internet in her lab...! No wait..?
Lag started happening all of a sudden...! Why is this..??
Hmm.. Like this.. Someone in the lab... I think I'm kidding..!
Dream, who usually studied information security through DreamHack, wants to find the culprit... can Dream catch the culprit?

★ Flag is a base64 encoded value of the attacker's IP address.
ex) 127.0.0.1 → bisc2024{MTI3LjAuMC4x}
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@dodoh4t</b> 
</p>

Đầu tiên mình check xem có IP nào xuất hiện
```bash
tshark -r packet.pcap -T fields -e ip.src | sort | uniq -c | sort -nr | less
```

![[Pasted image 20260409103533.png]]

Thì mình thấy có các IP 0.x.x.x. chỉ gửi 1 gói tin rất khả nghi có khả năng là ==Spoof==
Mình lọc tiếng các gói này ra để kiểm tra
```bash
tshark -r packet.pcap -Y "ip.src[0]==0" -T fields -e ip.src -e frame.len | sort | uniq -c | sort -nr
```

![[Pasted image 20260409103537.png]]

Mình khá chắc đây là ==Spoof==
Tiếp theo mình xem Mac của các IP này

![[Pasted image 20260409103540.png]]

Mình phát hiện các IP đều có chung ==eth.src== vì vậy mình sẽ tìm IP thật của MAC đó
```bash
tshark -r packet.pcap -Y "eth.src==00:0c:29:cf:3c:76 && arp" -T fields -e arp.src.proto_ipv4 -e arp.opcode | sort -u
```

![[Pasted image 20260409103543.png]]

Vậy là đã rõ =="192.168.0.22"== đây chính là IP thật của attacker
Decode qua base64 là mình có được flag

![[Pasted image 20260409103546.png]]

>Flag: bisc2024{MTkyLjE20C4wLjIy}

---

## [Grand Theft Auto](https://dreamhack.io/wargame/challenges/1362)
:::info
Description
Are you interested in car 🚗 hacking?
Find out what kind of car it is from the file obtained by communicating with the car's CAN!

Flag format: DH {[year] _ [manufacturer] _ [model name]}

For example, if the vehicle is “2014, Hyundai, Sonata,” the flag will be DH {2014_Hyundai_Sonata}.
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@jjong22</b> 
</p>

Đầu tiên mình được file text nhưng chứa dãy gì mình không hiểu

![[Pasted image 20260409103550.png]]

Sau khi hỏi chat thì giải được dãy sau ==WDDHF5GB5BA270866== và đây là số Vin xe 
>Flag: DH{2011_Mercedes-Benz_E-Class}

---

## [chrome_artifacts](https://dreamhack.io/wargame/challenges/1328)
:::info
You've been asked by a customer to analyze a hacking incident.

The icon image (.ico) that appears to have been used in the crime appears to have been downloaded from an external Internet site.

Analyze Chrome browser artifacts to obtain flags.
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@Dreamhack</b> 
</p>

Để tìm các giá trị A, B, C mình cần phải tìm các file artifacts của trình duyệt, mình vào đường dẫn
`root\Users\victim\AppData\Local\Google\Chrome\User Data\Default` và export 2 file ra

![[Pasted image 20260409103605.png]]

Tại bảng Downlaods của file History mình tìm thấy A, B, C mà đề yêu cầu
**A: Tên file .ico - "Dtafalonso-Android-L-Chrome"**
**B: Timestamp lúc tải - 1712416601**
```=
Unix = (WebKit / 1_000_000) − 11644473600
13356890201309017 / 1_000_000 = 13356890201.309017
13356890201.309017 − 11644473600 = 1712416601.309017
```

![[Pasted image 20260409103610.png]]

**C: MINE type của file**

![[Pasted image 20260409103614.png]]

>Flag: DH{Dtafalonso-Android-L-Chrome_1712416601_image/x-icon}

---

## [nikonikoni](https://dreamhack.io/wargame/challenges/1327)
:::info
You've been asked by a customer to analyze a hacking incident.

The content of my request was that my computer wallpaper was suddenly changed to an animated character!

Analyze the event log of the given image and analyze the malware executed on the PC.
:::

---
Vì yêu cầu tìm ứng dụng thay đổi ảnh nền nên mình đã vào Program `File` để  xem có thư mục nào đáng ngờ không thì thấy có ứng dụng tên `RUXIM` nghe khá là lạ nên mình cho rằng đây là ứng dụng thay đổi ảnh nền

![[Pasted image 20260409103618.png]]

Tiếp đến mình tìm ảnh mình vaod đường dẫn `root\Users\victim\AppData\Roaming\Microsoft\Windows\Themes` thì tìm được ảnh cần tìm 

![[Pasted image 20260409103642.png]]

Tiếp đến là timestap của script khi chạy mình dùng `relookup` để tìm trong `NTUSER.DAT` sau đó đổi sang timestamp

![[Pasted image 20260409103646.png]]

Vậy A, B, C lần lượt là
```=
A: RUXIM
B: CachedImage_1920_1024_POS4
C: 1712417208
```

Nhưng đáp án trên sai hoàn toàn vì nó chỉ là ồi nhử thôi vì khi tìm kiếm trong FTK mình tìm trong Logs và phát hiện ra có file evtx khá là đáng nghi

![[Pasted image 20260409103650.png]]

Khi dùng tool để đọc file thì mình tìm thấy 1 đường dẫn tới github chứa malware

![[Pasted image 20260409103654.png]]

Và trong file trên cũng đã tiết lộ thời tên của ứng dụng đổi hình nền cùng với tên của ảnh khi đổi mặc dù là 1 với ảnh mình tìm được

![[Pasted image 20260409103657.png]]

![[Pasted image 20260409103702.png]]

Và timestamp khi script chạy nằm ở file Security.evtx khi tìm Eventid 4688 cuối  

![[Pasted image 20260409103705.png]]

>Flag: DH{merong_ani_1712417205}

---

## [boot_time](https://dreamhack.io/wargame/challenges/1326)
:::info
You've been asked by a customer to analyze a hacking incident.

Analyze the event log of the given image to obtain the time when the PC was last booted.
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@Dreamhack</b> 
</p>

Để tìm lần cuối boot time mình truy cập đường dẫn `root\windows\System32\winevt\Logs` và export file `Security.evtx` 
![image](https://hackmd.io/_uploads/By_PH0CmZe.png)

Tiếp đến mình dùng tool để đọc file
```
wine EvtxECmd.exe -f Security.evtx --csv out
```

Và tìm thởi điểm máy khởi động ở lần cuối

![[Pasted image 20260409103716.png]]

Có thể thấy máy tính đã khởi động tổng cộng 9 lần và mình chỉ cần lấy lần gần nhất

![[Pasted image 20260409103719.png]]

Sau đó mình đổi sang UTC+9 
`2024-04-06 15:23:44 --> 2024-04-07 00:23:44`

>Flag: DH{2024_04_07_00_23_44}

---

## [Track_the_file](https://dreamhack.io/wargame/challenges/1325)
:::info
Dream was looking at the computer and found something suspicious. It was malware.exe said that a program called that had been created on the computer. Dream is guessing someone copied the file by connecting to a USB.

Analyze the system log to find out when the malware.exe file was copied to the system!
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@Dreamhack</b> 
</p>

Tiếp tục với file malware ở bài Autorun bài này cần tìm thời gian mà malware dược copy vào máy qya USB hay nói cách khác là được tạo trên máy nạn nhân nên mình chỉ cần đọc thông tin mô ả của file là tìm được nhưng đây là thời gian theo chuẩn UTC mình cần phải đổi sang UTC+9
`4/4/2024 12:10:46 --> 4/4/2024 21:10:46`

![[Pasted image 20260409103723.png]]


>Flag: DH{2024_04_04_21_10_46}

---

## [Find the USB](https://dreamhack.io/wargame/challenges/1324)
:::info
Description
[Practice together] This is an exercise question on Find the USB.

I think someone connected and unplugged a USB storage device to Dream's computer.

The incident is said to have occurred in April 2024. Can I analyze the Windows registry to find connected USB information?

info
FLAG = DH{VID_PID_DeviceSerialNumber}
For exampleVID, AAAABBBB if PID a 11112222, and DeviceSerialNumber a is, the flag DH{1111_2222_AAAABBBB} is.
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@Dreamhack</b> 
</p>

Do bài này cần tìm VID và FID nên mình càn dungf FTK để trích xuất mục config
**`Windown/System32/config`**

![[Pasted image 20260409103728.png]]

Sau khi suât xong mình dùng tool để tìm
**`registryspy`**
Mở tool say đó mở file SYSTEM trong phần config
Rồi đi dến đường dẫn sau 
**`ControlSet001\Enum\USB`**

![[Pasted image 20260409103733.png]]

Và mình thấy có rất nhiều mục trong đó chọn bất cứ mục nào sau đó ghép lại sẽ thành flag
>Flag: DH{058F_6387_03A49E66}

---

## [Autoruns](https://dreamhack.io/wargame/challenges/1323)
:::info
After someone connected and disconnected a USB storage device to Dream's computer, the calculator program was running every time the computer was rebooted. What the hell just happened?

Look for flags by analyzing the Windows registry.
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@Dreamhack</b> 
</p>

Tìm hàm băm của file malware được truyền qua USB thì khi mình truy cập file disk thì phát hiện trong phần USER có 1 USER là victim trông sus lắm mở lên kiểm tra thì tìm được file malware cần tìm 

![[Pasted image 20260409103739.png]]

Lấy hàm băm của file 

![[Pasted image 20260409103743.png]]

>Flag: DH{302021d31f2d0bce01d7afc26bfe2ba2}

---

## [abcdefg-who](https://dreamhack.io/wargame/challenges/1225)
:::info
Dream is running a server.

Since Dream's password was leaked one day, I've learned that the server has changed slightly.

Look for the flag!
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@Dreamhack</b> 
</p>

Đầu tiên mình kiểm tra xem mình đang ở vị trí nào thì biết được đang ở user dream

![[Pasted image 20260409103747.png]]

Sau đó mình xem thông tin các user khác có trên server

![[Pasted image 20260409103751.png]]

Và sau khi kiểm tra từng user và mình thấy user `frank` có 1 file là `.secret_log` rất là đáng nghi vì thể mình thử truy câp nhưng đã bị từ chối

![[Pasted image 20260409103755.png]]

Tiếp theo mình thử dùng quyền `sudo` để mở file thì thấy lệnh được chạy liên tục làm cho mình không thể nhìn được gì
Vì vậy mình có thể kết luận file này chứa escape sequences và ghi liên tục khiến cho mình không thể đọc được nên mình sẽ dùng lệnh để hạn chế việc này và chỉ đọc thông tin cần thiết
```
sudo head -n 50 /home/frank/.secret_log | cat -v
```

![[Pasted image 20260409103759.png]]

>DH{MY_n3w_keYl0g9er_g0OD}

---

## [Corrupted Disk Image](https://dreamhack.io/wargame/challenges/1189)
:::info
Description
[Practice together] This is a problem practiced by Practicing Disk Image.

The disk image won't open...!

Restore the given disk image to obtain the flags.

info
FLAG: DH{something}
somethingThe length of is 32 characters.
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@Dreamhack</b> 
</p>

Đầu tiên mở file E01 bằng FTK thì mình không thấy có bất cứ file nào khác ngoài mục ==unallocated space== nên mình nghĩ file đã bị hỏng nội dung

![[Pasted image 20260409103803.png]]

Sau khi xuất ra và nghiên cứu thì mình phát hiện ra hệ thống tệp ==NTFS== nằm ở cuối

![[Pasted image 20260409103808.png]]

Nên mình copy và dán lên đầu file

![[Pasted image 20260409103811.png]]

Mở lại FTK và thêm file mới chỉnh sữa vào thì đáng chú ý có 2 file là ==key file== vàảnh png

![[Pasted image 20260409103931.png]]

Mở ảnh thì được hint là chuyển nội dung key file sang Sha-256

![[Pasted image 20260409103939.png]]

Dùng tools để chuyển và mình có flag

![[Pasted image 20260409103942.png]]

>Flag: DH{QWRETUIYFGHDDFMVBNCBVFZSTYJNBFSARTWYERDFBDFSDFATYERTHFGBSDFATEWYR DFGBDFSAEWEYRHDFGQWRETUIYFGHDDFMVBNCBVFZSTYJNBFSARTWYERDFBDFSDFA TYERTHFGBSDFATEWYRDFGBDFSAEWEYRHDFGQWRETUIYFGHDDFMVBNCBVFZSTYJNB FSARTWYERDFBDFSDFATYERTHFGBSDFATEWYRDFGBDFSAEWEYRHDFGQWRETUIYFGH DDFMVBNCBVFZSTYJNBFSARTWYERDFBDFSDFATYERTHFGBSDFATEWYRDFGBDFSAEW EYRHDFGQWRETUIYFGHDDFMVBNCBVFZSTYJNBFSARTWYERDFBDFSDFATYERTHFGBS DFATEWYRDFGBDFSAEWEYRHDFGQWRETUIYFGHDDFMVBNCBVFZSTYJNBFSARTWYERD FBDFSDFATYERTHFGBSDFATEWYRDFGBDFSAEWEYRHDFGQWRETUIYFGHDDFMVBNCB}

---

## [VBR](https://dreamhack.io/wargame/challenges/1188)
:::info
Description
[Practice together] This is a problem practiced in VBR.

Analyze the given VBR and calculate the flags.

info
FLAG = DH{(A + B + C)} (However, the added value will be converted to a decimal number)

A: If the file system is FAT32 or NTFS 1 2
B: The size of that volume
C: volume serial number
For example, since the file systemNTFS, volume size0x100000, and volume serial number are 0x12341234 cotton 2 + 0x100000 + 0x12341234 = 0x12441236 = 306450998 (decimal), you can submit. DH{306450998}
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@Dreamhack</b> 
</p>

>DH{2343104139}

---

## [Windows Search](https://dreamhack.io/wargame/challenges/729)
:::info
Description
Do you know "Windows Search" with (windows + s) command?

Find the flag.txt!
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@hunjison</b> 
</p>

Đọc thông tin các bảng trong file edb
```bash
esedbinfo Windows.edb
```

![[Pasted image 20260409104114.png]]

Mình thấy 2 bảng tiềm năng chứa flag 

![[Pasted image 20260409104136.png]]

![[Pasted image 20260409104153.png]]

Trích xuất 2 bảng để tìm flag
```bash
esedbexport -m all -T SystemIndex_PropertyStore -t prop Windows.edb
```

![[Pasted image 20260409104157.png]]

```bash
esedbexport -m all -T SystemIndex_Gthr -t gthr Windows.edb
```

![[Pasted image 20260409104202.png]]

Dùng lệnh để lọc các mục chứa flag trong 2 folder mình vừa trích xuất ra
```bash
grep -RniE 'flag\{|ctf\{|thm\{|htb\{|{.*}' prop.export/ gthr.export/
```

![[Pasted image 20260409104205.png]]

>Flag: DH{d0_y0u_kN0w_how_wINDOws_seArcH_w0rk?}

---

## [lolololologfile](https://dreamhack.io/wargame/challenges/727)
:::info
Description
Someone deleted the PDF file which has flag!

How can I recover it?
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@hunjison</b> 
</p>

Dùng FTK để phân tích trước do phần miêu tả bảo file pdf bị xóa nên mình sẽ chú tâm và 2 mục là ==Recycle bin== và ==Unallocated space== 

![[Pasted image 20260409104210.png]]

Tại mục ==Unallocated space== mình thấy có file pdf nhưng bị lỗi và mình thấy 4 file đầu có size rất lạ và tên file lại sắp theo thứ tự

![[Pasted image 20260409104216.png]]

Nên mình ghép 4 file lại

![[Pasted image 20260409104226.png]]

Và thế là mình có được flag

![[Pasted image 20260409104229.png]]

>Flag: DH{1_lov3_For3NSiCS_Not_F0ur_AND_six}

---

## [Basic_Forensics_1](https://dreamhack.io/wargame/challenges/518)
:::info
Description
A Hidden message is hidden in the image file.
Keyword: W4! TeBear
flag: DH {flag}
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@</b> 
</p>

Mình thấy đây là png nên dùng zsteg thì ra luôn flag

![[Pasted image 20260409104239.png]]

>Flag: DH{Wh!te_Be4r_In_Dream_4ack}

---

## [FFFFAAAATTT](https://dreamhack.io/wargame/challenges/303)
:::info
Description
FIXFIXFIX! FFFAAATTT!

(Please do not download the problem file from the download link; download the problem file from the link below.)
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@HHJ</b> 
</p>

Đầu tiên mình ném file ==FFFFAAAATTTT.001== vào FTK thì được thông báo là file lỗi nên mình dùng hexdump để check header xem có bị sai không thì thấy phần đầu bị lỗi

![[Pasted image 20260409104256.png]]

Sau đó mình copy phần dưới và dán đè lên phần ==Fix the Disk==


![[Pasted image 20260409104317.png]]

Sau đó thì lưu file
Tiếp đến mình mở FTK và mở file đã lưu

![[Pasted image 20260409104321.png]]

Mình mở mục Dreamhack thì thấy toàn bộ đều ko xem dạng hex được nên xuất hết ra 

![[Pasted image 20260409104340.png]]

![[Pasted image 20260409104343.png]]

Sau đó vào thư mục đã xuất 

![[Pasted image 20260409104347.png]]

Mình thấy có file zip nhưng nó yêu cầu mật khẩu

![[Pasted image 20260409104351.png]]

Tiếp đến mình ném từng file vào hexdump thì phát hiện tại file ==GG.PNG== có key

![[Pasted image 20260409104403.png]]

Nhập key và mình giải nén được thư mục noway tróng đó có file txt

![[Pasted image 20260409104407.png]]

Và mở file txt thì mình có được flag

![[Pasted image 20260409104412.png]]

>Flag: DH{3a5y_FAT32_r3bui1d}

---

## [Snowing!](https://dreamhack.io/wargame/challenges/241)
:::info
Description
Dream is: Whoa! There's a lot of snow outside!
Dream Mom: Yes,
Dream: Almost all of them are white spaces.
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@HHJ</b> 
</p>

Khi giải nén mình được file DH.zip, giải nén tiếp mình được 2 file là Snow.jpeg và flag.txt 
Nhưng khi phân tích tấm ảnh thì mình chả thu được gì mở file flag.txt thì chỉ được fake flag và khoảng trắng nhưng đề bài có miêu tả =="Almost all of them are white spaces"== 

![[Pasted image 20260409104416.png]]

Nên mình dùng stegsnow

![[Pasted image 20260409104422.png]]

>Flag: DH{w0w_1t_Sn0w5}

---

## [Hefty Image](https://dreamhack.io/wargame/challenges/2455)
:::info
A friend sent me a file saying it was a picture taken during a trip. However, for a normal photo file, the size is a bit heavy.

I don't think it's just a picture. Earn flags by uncovering secrets hidden in image files!
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@jinsuda</b> 
</p>

Đọc file với strings ra luôn flag hoặc muốn làm theo ý tưởng của tác giả thì dùng binwalk để xuất file flag.txt ra khỏi ảnh và đọc flag

![[Pasted image 20260409104428.png]]

>DH{s1mpl3_st3g4n0gr4phy_w1th_c0nc4t}

---

## [Gyul Box](https://dreamhack.io/wargame/challenges/2530)
:::info
Rootsquare has been arrested by 0xB1nary COMMUNITY agents for hiding confidential documents, slush funds, and golden tangerines in a tangerine box!

But when I opened the box, it was really just tangerines! Where did they hide the secret?

Above all... I don't think this is a single box! I think there's another box inside the box...?
:::
<hr>
<p style="text-align:right; font-style:italic;">
  Author: <b>@Rootsquare</b> 
</p>

Thử tách cung cấp cho mình 2 file ảnh là jpg và png 

Đầu tiên mình xuất file ẩn trong ảnh jpg và thu được file zip

![[Pasted image 20260409104433.png]]

Khi giải nén thì mình thu được 3 file sau

![[Pasted image 20260409104437.png]]

Và mình cần phải giải mã file enc để thu được file ẩn trong đó và gọi ý để giải mã là file ảnh và text 

Mình dùng script python để giải mã file enc thành file zip

```python
with open("small_box.enc", "rb") as f:
    data = f.read()

dec = bytes((b - 93) % 256 for b in data)

with open("small_box.zip", "wb") as f:
    f.write(dec)
```


Sau đó mình giải nén file và thu được file enc thứ 2 và 1 file hint và từ hint mình biết được cần phải có key để giải mã file enc thứ 2 này nên mình đi tìm key đó

Sau khi tiếp kiếm thì mình thấy được key để giải mã khi quay lại ảnh png ban đầu và dùng binwalk để xuấ file và đọc nó

![[Pasted image 20260409104450.png]]
![[Pasted image 20260409104509.png]]

Mình dùng lệnh sau để giải mã file enc thứ 2
```
openssl enc -d -aes-256-ecb -K 7e1cbabc03360aa6a25d7c85ece471beb2d9517c23f38a1ccec4d0206c0e00f8 -in gyul.png.enc -out gyul.png
```
Giải mã xong mình thu được ảnh png chứa flag

![[Pasted image 20260409104518.png]]

>B1N4RY{You_peeled_the_gyul}
