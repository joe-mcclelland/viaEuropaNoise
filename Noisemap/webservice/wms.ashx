<%@ WebHandler Language="C#" Class="wms" %>

using System;
using System.Web;
using System.Collections.Generic;
using System.Web.Services;
using System.Net;
using System.IO;
using System.Text;

public class wms : IHttpHandler {

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

            if (!String.IsNullOrEmpty(uri))
            {

                System.Uri wmsURL = new Uri(uri);
                WebRequest rssReq = WebRequest.Create(wmsURL);
                //rssReq.Proxy = WebProxy.GetDefaultProxy();
                //rssReq.Proxy.Credentials = CredentialCache.DefaultCredentials;
                rssReq.Timeout = 120000;

                HttpWebResponse response = (HttpWebResponse)rssReq.GetResponse();
                if (response.ContentType.Contains("application/vnd.ogc.wms_xml") || response.ContentType.Contains("WMS_XML") || response.ContentType.Contains("xml") || response.ContentType.Contains("html") || response.ContentType.Contains("text"))
                {
                    StreamReader dataStream = new StreamReader(response.GetResponseStream());
                    StringBuilder sbSource = new StringBuilder(dataStream.ReadToEnd());
                    context.Response.ContentType = "application/html";
                    context.Response.Write(sbSource);
                }
                else
                {
                    StreamReader dataStream = new StreamReader(response.GetResponseStream());
                    StringBuilder sbSource = new StringBuilder(dataStream.ReadToEnd());
                    context.Response.ContentType = "application/html";
                    context.Response.Write(sbSource);
                    //BinaryReader br = new BinaryReader(response.GetResponseStream());
                    //byte[] outb = br.ReadBytes((int)response.ContentLength);
                    //br.Close();
                    //context.Response.CacheControl = "no-cache";
                    //context.Response.OutputStream.Write(outb, 0, outb.Length);
                }
            }
        }
        catch (Exception ex)
        {
            //context.Response.ContentType = "application/html";
            //context.Response.Write(sbSource);
            throw new Exception("error occured with WMS" + ex.Message);
        }
    }

    public bool IsReusable {
        get {
            return false;
        }
    }

}