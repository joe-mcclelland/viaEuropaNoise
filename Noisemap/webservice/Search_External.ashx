<%@ WebHandler Language="C#" Class="Search_External" %>

using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Services;
using System.Net;
using System.IO;
using System.Text;
using System.Configuration;
using System.Collections;
using System.Data;

public class Search_External : IHttpHandler {
    
    public void ProcessRequest (HttpContext context) {
        try
        {
            string uri = context.Request.Url.Query.Substring(1);
            int count = uri.Split('?').Length - 1;
            if (count > 1)
            {
                int first = uri.IndexOf("?");
                string firstPart = uri.Substring(0, first + 1);
                string secondPart = uri.Substring(first + 1);
                secondPart = secondPart.Replace("?", "&");
                uri = firstPart + secondPart;
            }

            //WHat type of Search?
            int stPos = uri.IndexOf("st=");
            string strPos = uri.Substring(stPos + 3);
            int stPos2 = strPos.IndexOf("&");
            string Search_Type = strPos.Substring(0,stPos2);
            string strParams =  uri.Remove (stPos, stPos + stPos2);

            string test2 = uri;
            int index1 = test2.IndexOf("st=");
            int index2 = test2.IndexOf('&', index1 + 1);
            string result2 = test2.Remove(index1, (index2 - index1)+1);

            //Postcode Search
            //string URLlist = "http://wms.locationcentre.co.uk/addressbase/service/";
            string URLlist = "https://map.sepa.org.uk/proxy/thinkwhere.ashx?https://api.themapcloud.com/address/addressbase/";			
			//https://map.sepa.org.uk/proxy/thinkwhere.ashx?https://api.themapcloud.com/address/addressbase/postcode
            //string SEPA_Key = "key=sepa_bf5394";

            //URLlist = URLlist + Search_Type + "?" + result2 + "&" + SEPA_Key;
            URLlist = URLlist + Search_Type + "?" + result2;			

            if (!String.IsNullOrEmpty(URLlist))
            {
                var httpWebRequest = (HttpWebRequest)WebRequest.Create(URLlist);
                httpWebRequest.Timeout = 120000;
                httpWebRequest.Method = "POST";

                using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
                {
                    string json = "{\"x\":\"true\"}";
                    streamWriter.Write(json);
                    streamWriter.Flush();
                }

                var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();
                using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
                {
                    var result = streamReader.ReadToEnd();
                    context.Response.Write(result);
                }

                //System.Uri wmsURL = new Uri(uri);
                //WebRequest rssReq = WebRequest.Create(wmsURL);
                ////rssReq.Proxy = WebProxy.GetDefaultProxy();
                //rssReq.Proxy.Credentials = CredentialCache.DefaultCredentials;
                //rssReq.Timeout = 120000;

                //HttpWebResponse response = (HttpWebResponse)rssReq.GetResponse();

                //StreamReader dataStream = new StreamReader(response.GetResponseStream());
                //StringBuilder sbSource = new StringBuilder(dataStream.ReadToEnd());
                //context.Response.Write(sbSource);

            }
        }
        catch (Exception ex)
        {
            context.Response.ContentType = "application/html";
            context.Response.Write("error occured with WMS" + ex.Message);
        }
    }

    public bool IsReusable {
        get {
            return false;
        }
    }

}