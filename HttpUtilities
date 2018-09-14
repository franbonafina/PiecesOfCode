using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net;
using System.IO;
using System.Net.Cache;
using System.Threading;
using System.Runtime.CompilerServices;
//using iTvUpdateEngineLib;

namespace GenerateDictionaries
{
    public class HttpUtilities
    {
        static Dictionary<string, HttpCookie> _cookies = new Dictionary<string, HttpCookie>();
       
        static void ProcessServerCookies(HttpWebRequest req, HttpWebResponse resp)
        {           
            HttpCookie cookie = new HttpCookie(req, resp);
            if (cookie.values.Count > 0)
            {
                lock (_cookies)
                {
                    _cookies[cookie.UniqueKey] = cookie;
                }
            }        
        }
        
        static HttpCookie FindCookie(string strUrl)
        {           
            HttpCookie cookie = null;
            lock (_cookies)
            {
                string Key = (from k in _cookies.Keys where strUrl.IndexOf(k) != -1 select k).FirstOrDefault();
                if (Key != null)
                {
                    _cookies.TryGetValue(Key, out cookie);
                }
            }

            return cookie;
        }

        protected static HttpWebRequest PrepareHttpRequest(string strUrl, string strUser, string strPwd, byte[] arPostData, string strReferer)
        {
            return PrepareHttpRequest(strUrl, strUser, strPwd, arPostData, strReferer, null);
        }

        protected static HttpWebRequest PrepareHttpRequest(string strUrl, string strUser, string strPwd, byte[] arPostData, string strReferer, List<HttpRequestHeader> httpHeaders)
        {
            HttpWebRequest req = null;

            try
            {
                req = (HttpWebRequest)WebRequest.Create(strUrl);

                if (strUser.Length > 0)
                {
                    req.PreAuthenticate = true;
                    NetworkCredential networkCredential = new NetworkCredential(strUser, strPwd);
                    req.Credentials = networkCredential;
                    req.Pipelined = false;
                    req.KeepAlive = false;
                }

                req.Proxy = WebRequest.GetSystemWebProxy();
                req.Accept = "*/*";
                req.UserAgent = "DTVLA iTvUpdateEngine";
                req.CachePolicy = new HttpRequestCachePolicy(HttpRequestCacheLevel.BypassCache);
                req.ProtocolVersion = HttpVersion.Version10;
                req.Timeout = 3600000;

                if (httpHeaders != null)
                {
                    foreach (HttpRequestHeader header in httpHeaders)
                    {
                        //req.Headers.Add("Authorization", "Bearer gAAAAGyCcvvqqVr58d4abG7oFDQQs6EJhKjUn22iNk6Wo8xlRqDYzPvnYEBjlWtw6o1DEhdLNQWeH1ST7Gb2L_SNb3Gt-fujmcKabD-9rQ4Z36DJxF3c5vX8tco0SWbWnUUPZbmITfp7lRTD1AKF_39dgwgE5aHze4CjN8YEPzIyt1rz9AAAAIAAAACAoe0kZXKGqWWfTA5fJge9cyo3Ymq63uXfKpjEgBt3iNxGUePTq0LDMaUm2DUenn4uUV5Tz2qbK5mp-LxrmbHOzPOhaj2angmbDh621lOwlBY3hrGcG7_odc1CUuAKMP0GHZqHFbhXpt6ZBpV4YxV7o1eeezZADAZMLoiipp-bU1xeYxpbP9MbsDdW6-QSDQ1I2LA-D9skPHWvklmA-gd9BwPPorRyG2mn9kr-PfT0EbrPbP6BYhbJVHjtTwBYkscc8zLh2mY2WN9K8yGCeluD1mneXqqgkikelTFlL49WVt3q7x3IbyBXRy7x_daOfdc");    
                        req.Headers.Add(header.Name, header.Value);
                    }
                }

                HttpCookie cookie = FindCookie(strUrl);
                if (cookie != null)
                {
                    req.Headers["Cookie"] = cookie.GetClientRawCookie();
                }


                if (arPostData != null && arPostData.Length > 0)
                {
                    req.Method = "POST";
                    Stream reqStream = req.GetRequestStream();
                    reqStream.Write(arPostData, 0, arPostData.Length);
                    reqStream.Close();
                }
                else
                {
                    req.Method = "GET";
                }

                if (strReferer.Length > 0)
                {
                    req.Referer = strReferer;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return req;
        }

        public static bool DownloadHttpFile(string strUrl, string strUser, string strPwd, string strPostData, string strReferer, int nRepeat, out string strOut)
        {
            bool bResult = false;
            strOut = "";

            for (int n = 0; n < nRepeat && !bResult; n++)
            {                
                bResult = DownloadHttpFile(strUrl, strUser, strPwd, strPostData, strReferer, out strOut);

                if (!bResult)
                {
                    Thread.Sleep(5000);
                }
            }

            if (!bResult)
            {
         //       LogFile.Instance().Log(UpdateEngine.ModuleName, LogMsgType.msgError, "Could not download file after " + nRepeat.ToString() + " attempts. File:" + strUrl);
            }

            return bResult;
        }


        public static bool DownloadHttpFile(string strUrl, string strUser, string strPwd, string strPostData, string strReferer, out string strOut)
        {
            strOut = "";
            byte[] arOut = null;

            bool bResult = DownloadHttpFile(strUrl, strUser, strPwd, Encoding.UTF8.GetBytes(strPostData), strReferer, null, out arOut);

            if (arOut != null)
            {
                strOut = new String(Encoding.GetEncoding(0).GetChars(arOut, 0, arOut.Length));
                //strOut = new String(Encoding.UTF8.GetChars(arOut, 0, arOut.Length));

            }

            return bResult;
        }


        public static bool DownloadHttpFile(string strUrl, string strUser, string strPwd, byte[] arPostData, string strReferer, List<HttpRequestHeader> requestHeaders, out byte[] arOut)
        {
            HttpWebResponse res = null;
            HttpWebRequest req = null;
            bool bResult = false;
            arOut = null;
            int nRead = 0;
            byte[] arBytes = new byte[1000];

            MemoryStream memOut = new MemoryStream();


            try
            {
                req = PrepareHttpRequest(strUrl, strUser, strPwd,
                    arPostData, strReferer, requestHeaders);

                try
                {
                    res = (HttpWebResponse)req.GetResponse();
                }
                catch (WebException ex)
                {
                    string strError = "Exception occured during sending " + req.Method + " request " + strUrl + " " + ex.Message + " ";
                    if (ex.Response != null)
                    {
                        res = (HttpWebResponse)ex.Response;
                    }
                  //  LogFile.Instance().Log(UpdateEngine.ModuleName, LogMsgType.msgWarning, strError);
                }
                
                if (res != null)
                {                    
                    //Process cookies
                    ProcessServerCookies(req, res);

                    //Download page
                    arBytes = new byte[1000];
                    do
                    {
                        nRead = res.GetResponseStream().Read(arBytes, 0, arBytes.Length);
                        if (nRead > 0)
                        {
                            memOut.Write(arBytes, 0, nRead);
                            //strOut += new String(Encoding.GetEncoding(0).GetChars(arBytes, 0, nRead));
                        }
                    }
                    while (nRead != 0);

                    bResult = (res.StatusCode == HttpStatusCode.OK);
                    memOut.Position = 0;
                    arOut = new byte[memOut.Length];
                    memOut.Read(arOut, 0, arOut.Length);
                    memOut.Close();                
                }

            }
            catch (Exception ex)
            {
               // LogFile.Instance().Log(UpdateEngine.ModuleName, LogMsgType.msgWarning, "Exception occured during downloading file " + strUrl + " " + ex.Message);
            }
            finally
            {
                // Clean up
                if (res != null)
                {
                    res.Close();
                }
            }

            return bResult;
        }


        public static bool PostHttpFormData(string strUrl, string strUser, string strPwd, Dictionary<string, HttpPostData> dictPostData, string strReferer, out string strOut)
        {
            byte[] arOut = null;
            strOut = "";
            bool bResult = PostHttpFormData(strUrl, strUser, strPwd, dictPostData, strReferer, out arOut);

            if (arOut != null)
            {
                strOut = new String(Encoding.GetEncoding(0).GetChars(arOut, 0, arOut.Length));
            }

            return bResult;
        }

        public static bool PostHttpFormData(string strUrl, string strUser, string strPwd, Dictionary<string, HttpPostData> dictPostData, string strReferer, out byte[] arOut)
        {
            HttpWebResponse res = null;
            bool bResult = false;            
            arOut = null;

            try
            {
                HttpWebRequest req = null;
                string boundary = "----------------------------" + DateTime.Now.Ticks.ToString("x");                
                MemoryStream postDataStream = new System.IO.MemoryStream();
                byte[] data = null;
                MemoryStream memOut = new MemoryStream();

                if (dictPostData.Count > 0)
                {                                        
                    string formdataTemplate = "--" + boundary +
                        "\r\nContent-Disposition: form-data; name=\"{0}\"\r\n\r\n{1}";

                    string formfileTemplate = "--" + boundary +
                        "\r\nContent-Disposition: form-data; name=\"{0}\"; filename=\"{1}\"\r\nContent-Type: application/octet-stream\r\n\r\n";
                    
                    foreach (KeyValuePair<string, HttpPostData> it in dictPostData)
                    {
                        if (postDataStream.Length > 0)
                        {
                            data = Encoding.UTF8.GetBytes("\r\n");
                            postDataStream.Write(data, 0, data.Length);
                        }

                        if (it.Value.isFile)
                        {
                            data = Encoding.UTF8.GetBytes(string.Format(formfileTemplate, it.Key, it.Value.filename));
                            postDataStream.Write(data, 0, data.Length);
                            if (it.Value.data != null)
                            {
                                postDataStream.Write(it.Value.data, 0, it.Value.data.Length);
                            }
                        }
                        else
                        {
                            data = Encoding.UTF8.GetBytes(string.Format(formdataTemplate, it.Key, it.Value.value));
                            postDataStream.Write(data, 0, data.Length);
                        }
                    }

                    data = Encoding.UTF8.GetBytes("\r\n--" + boundary + "--\r\n");
                    postDataStream.Write(data, 0, data.Length);

                    //LogFile.Instance().Log(UpdateEngine.ModuleName, LogMsgType.msgInfo, strPostData);

                    postDataStream.Position = 0;
                    data = new byte[postDataStream.Length];
                    postDataStream.Read(data, 0, data.Length);
                    postDataStream.Close();
                }

                req = PrepareHttpRequest(strUrl, strUser, strPwd, null, strReferer);

                req.ContentLength = data.Length;
                req.ContentType = "multipart/form-data; boundary=" + boundary;
                req.Method = "POST";

                Stream reqStream = req.GetRequestStream();
                reqStream.Write(data, 0, data.Length);
                reqStream.Close();

                int nRead = 0;
                byte[] arBytes = new byte[1000];

                try
                {
                    res = (HttpWebResponse)req.GetResponse();
                }
                catch (WebException ex)
                {
                    string strError = "Exception occured during sending POST request " + strUrl + " " + ex.Message + " ";
                    if (ex.Response != null)
                    {
                        res = (HttpWebResponse)ex.Response;
                    }
                    //LogFile.Instance().Log(UpdateEngine.ModuleName, LogMsgType.msgWarning, strError);
                }


                if (res != null)
                {                    
                    //Process cookies
                    ProcessServerCookies(req, res);

                    //Download page
                    arBytes = new byte[1000];
                    do
                    {
                        nRead = res.GetResponseStream().Read(arBytes, 0, arBytes.Length);
                        if (nRead > 0)
                        {
                            memOut.Write(arBytes, 0, nRead);
                            //strOut += new String(Encoding.GetEncoding(0).GetChars(arBytes, 0, nRead));
                        }
                    }
                    while (nRead != 0);

                    memOut.Position = 0;
                    arOut = new byte[memOut.Length];
                    memOut.Read(arOut, 0, arOut.Length);
                    memOut.Close();

                    bResult = (res.StatusCode == HttpStatusCode.OK);
                }

            }
            catch (Exception ex)
            {
        //        LogFile.Instance().Log(UpdateEngine.ModuleName, LogMsgType.msgWarning, "Exception occured during sending POST request " + strUrl + " " + ex.Message);
            }
            finally
            {
                // Clean up
                if (res != null)
                {
                    res.Close();
                }
            }

            return bResult;
        }


    }


    public class HttpPostData
    {
        public HttpPostData(string value)
        {
            this.value = value;
            this.isFile = false;
        }

        public HttpPostData(string filename, byte[] data)
        {
            this.data = data;
            this.filename = filename;
            this.isFile = true;
        }

        public string filename;
        public string value;
        public byte[] data = null;
        public bool isFile = false;
    }

    class HttpCookie
    {
        public HttpCookie() { }
        public HttpCookie(HttpWebRequest req, HttpWebResponse resp) 
        {
            string strRawCookie = "";
            strRawCookie = resp.Headers["Set-Cookie"];
            if (strRawCookie == null) return;

            string[] arCookies = strRawCookie.Split(new string[] { ";" }, StringSplitOptions.RemoveEmptyEntries);

            foreach (string valuePair in arCookies)
            {
                string[] arValuePair = valuePair.Trim().Split(new string[] { "=" }, StringSplitOptions.RemoveEmptyEntries);
                if (arValuePair != null && arValuePair.Length == 2)
                {
                    //Check for reserved keywords
                    if (arValuePair[0].ToUpper() == "COMMENT")
                    {
                        Comment = arValuePair[1];
                    }
                    else if (arValuePair[0].ToUpper() == "DOMAIN")
                    { 
                        Domain = arValuePair[1];
                    }
                    else if (arValuePair[0].ToUpper() == "MAX-AGE")
                    { 
                        MaxAge = arValuePair[1];
                    }
                    else if (arValuePair[0].ToUpper() == "PATH")
                    {
                        Path = arValuePair[1];
                    }
                    else if (arValuePair[0].ToUpper() == "SECURE")
                    {
                        Secure = arValuePair[1];
                    }
                    else if (arValuePair[0].ToUpper() == "VERSION")
                    {
                        Version = arValuePair[1];
                    }
                    else
                    {
                        values[arValuePair[0].Trim()] = arValuePair[1].Trim();
                    }
                }
            }

            if (Domain.Length == 0)
            {
                Domain = req.Headers["Host"];
            }
        }

        public string GetClientRawCookie()
        {
            string strRawValues = "";
            foreach (KeyValuePair<string, string> it in values)
            {
                if (strRawValues.Length > 0)
                {
                    strRawValues += ";";
                }
                strRawValues += string.Format("{0}={1}", it.Key, it.Value);
            }

            string strRawCookie = "";

            if (strRawValues.Length > 0)
            {
               strRawCookie = "$Version=" + Version + "; " + strRawValues + "; $Path=" + Path;
            }

            return strRawCookie;
        }

        public string UniqueKey {
            get {
                return (Domain + Path);
            }
        }

        public string Path = "/";        
        public string Domain = "";
        public string MaxAge = "";
        public string Secure = "";
        public string Version = "0";
        public string Comment = "";
        public Dictionary<string, string> values = new Dictionary<string, string>();
    }

    public class HttpRequestHeader
    {
        public string Name = "";
        public string Value = "";
    }
}
