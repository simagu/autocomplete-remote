<%@LANGUAGE="VBSCRIPT" CODEPAGE="65001"%> 
<%Option Explicit%>
<%
Dim page : page = Request.QueryString("page")
Dim pageSize : pageSize = Request.QueryString("pageSize")
Dim term : term = Request.QueryString("term")

If page = "" Then page = "1"
If pageSize = "" Then pageSize = "10"

Dim cityArray(35)
cityArray(0) = "CHY嘉義縣"
cityArray(1) = "CWH彰化縣"
cityArray(2) = "CWS彰化市"
cityArray(3) = "CYI嘉義市"
cityArray(4) = "GNI綠島"
cityArray(5) = "HSC新竹市"
cityArray(6) = "HSH新竹縣"
cityArray(7) = "HWA花蓮縣"
cityArray(8) = "HWC花蓮市"
cityArray(9) = "ILC宜蘭市"
cityArray(10) = "ILN宜蘭縣"
cityArray(11) = "KHH高雄市"
cityArray(12) = "KLU基隆市"
cityArray(13) = "KMN金門縣"
cityArray(14) = "KYD蘭嶼"
cityArray(15) = "LNN連江縣"
cityArray(16) = "MAC苗栗市"
cityArray(17) = "MAL苗栗縣"
cityArray(18) = "MZG馬公市"
cityArray(19) = "MZW馬祖"
cityArray(20) = "NHD南海島"
cityArray(21) = "NTC南投市"
cityArray(22) = "NTO南投縣"
cityArray(23) = "PCH屏東縣"
cityArray(24) = "PEH澎湖縣"
cityArray(25) = "TIT中壢市"
cityArray(26) = "TNN台南市"
cityArray(27) = "TPE台北市"
cityArray(28) = "TPH新北市"
cityArray(29) = "TSA松山"
cityArray(30) = "TTC台東市"
cityArray(31) = "TTT台東縣"
cityArray(32) = "TXG台中市"
cityArray(33) = "TYC桃園市"
cityArray(34) = "YUN雲林縣"

Response.ContentType = "application/json"
Response.Write GetJsonResult(cityArray, term, page, pageSize)

Function GetJsonResult(ByVal cityArray, ByVal term, ByVal page, ByVal pageSize)
	Dim jsonItems: jsonItems = ""
	Dim beginIdx, endIdx
	Dim resultArray()
	
	beginIdx = CInt(page) * CInt(pageSize) - CInt(pageSize) + 1
	endIdx = CInt(page) * CInt(pageSize)
	
	Dim I, arrayIndex : arrayIndex = 0
	For I = 0 To UBound(cityArray)		
		If term = "" Or InStr(cityArray(I), term) > 0 Then			
			ReDim Preserve  resultArray(arrayIndex)
			resultArray(arrayIndex) = cityArray(I)
			arrayIndex = arrayIndex + 1			
		End If
	Next 'I	
	If arrayIndex = 0 Then
		GetJsonResult = "{ ""total"": 0, ""items"":[]}"
		Exit Function
	End If
	
	For I = 0 To UBound(resultArray)			
		If endIdx <= I Then Exit For
		If (I + 1) >= beginIdx Then
			Dim cityCode, cityName, dataValues
			cityCode = Mid(resultArray(I), 1, 3)
			cityName = Mid(resultArray(I), 4, Len(resultArray(I)))
			If jsonItems <> "" Then jsonItems = jsonItems & ","
			dataValues = """data"": { ""cityName"": """ & cityName & """, ""cityCode"": """ & cityCode & """} "
			jsonItems = jsonItems & "{""text"": """ & cityName & """, ""label"": """ + cityCode + "-" + cityName + """, ""value"": """ + cityCode + """, " & dataValues & " }"	
		End If
	Next 'I	
	GetJsonResult = "{ ""total"": " & UBound(resultArray) & ", ""items"":[" & jsonItems & "]}"
End Function

%>