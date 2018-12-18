using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Services;
using System.Configuration;
using Oracle.DataAccess.Client;
using System.Data;
using Oracle.DataAccess.Types;
using System.Text.RegularExpressions;
using System.Web.Services.Protocols;
using System.Web.Script.Services;

using System.Web.Configuration;

/// <summary>
/// Summary description for SearchData
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
[System.Web.Script.Services.ScriptService]
public class SearchData : System.Web.Services.WebService
{
    protected OracleConnection conn;
    public SearchData()
    {

        //Uncomment the following line if using designed components 
        //InitializeComponent(); 
    }
    [System.Web.Services.WebMethod(Description = "Gets Study Area List")]
    [ScriptMethod(UseHttpGet = true)]
    public List<studyareaDetail> StudyArea(String STUDY_SOURCE, String STUDY_ROUND)
    {
        try
        {
            if (GetDBConnection("sew01l_sdeuser"))
            {
                List<studyareaDetail> resultList = new List<studyareaDetail>();
                OracleCommand cmd = new OracleCommand();
                cmd.BindByName = false;
                cmd.Connection = conn;
                if (STUDY_SOURCE == "ALL")
                {
                    cmd.Parameters.Add("strStudyRound", OracleDbType.Varchar2).Value = STUDY_ROUND;
                    cmd.CommandText = "select distinct STUDY_AREA from SEWEBMASTER.SV_NO_NOISE_DATA where BAND is not null and ROUND = :strStudyRound and METRIC not in('LNIGHT_LOWEST','LDEN_LOWEST', 'LDAY','LOWEST') order by STUDY_AREA ";
                }
                else
                {
                    cmd.Parameters.Add("strStudySource", OracleDbType.Varchar2).Value = STUDY_SOURCE;
                    cmd.Parameters.Add("strStudyRound", OracleDbType.Varchar2).Value = STUDY_ROUND;
                    cmd.CommandText = "select distinct STUDY_AREA from SEWEBMASTER.SV_NO_NOISE_DATA where SOURCE = :strStudySource and ROUND = :strStudyRound and BAND is not null and METRIC not in('LNIGHT_LOWEST','LDEN_LOWEST', 'LDAY','LOWEST') order by STUDY_AREA ";
                }

                OracleDataReader dr = cmd.ExecuteReader();
                if (dr.HasRows)
                {
                    while (dr.Read())
                    {
                        string STUDY_AREA;
                        if (!DBNull.Value.Equals(dr["STUDY_AREA"]))
                        {
                            STUDY_AREA = dr["STUDY_AREA"].ToString();
                        }
                        else
                        {
                            STUDY_AREA = "None";
                        }

                        studyareaDetail RecordMBR = new studyareaDetail(STUDY_AREA);

                        resultList.Add(RecordMBR);
                    }
                }
                conn.Close();
                // return null;
                return resultList;
            }
            else
            {
                conn.Close();
                return null;
            }
        }
        catch (Exception ex)
        {
            throw new SoapException(String.Format("Error\n{0}", ex.Message), SoapException.ServerFaultCode);
        }
    }

    [System.Web.Services.WebMethod(Description = "Gets Study Source List")]
    [ScriptMethod(UseHttpGet = true)]
    public List<studysourceDetail> StudySource(String STUDY_AREA, String STUDY_ROUND)
    {
        try
        {
            if (GetDBConnection("sew01l_sdeuser"))
            {
                List<studysourceDetail> resultList = new List<studysourceDetail>();

                OracleCommand cmd = new OracleCommand();
                cmd.BindByName = false;
                cmd.Connection = conn;
                if (STUDY_AREA == "ALL")
                {
                    cmd.Parameters.Add("strStudyRound", OracleDbType.Varchar2).Value = STUDY_ROUND;
                    cmd.CommandText = "select distinct SOURCE  from SEWEBMASTER.SV_NO_NOISE_DATA where BAND is not null and ROUND = :strStudyRound and METRIC not in('LNIGHT_LOWEST','LDEN_LOWEST', 'LDAY','LOWEST') order by SOURCE ";
                }
                else
                {
                    cmd.Parameters.Add("strStudyArea", OracleDbType.Varchar2).Value = STUDY_AREA;
                    cmd.Parameters.Add("strStudyRound", OracleDbType.Varchar2).Value = STUDY_ROUND;
                    cmd.CommandText = "select distinct SOURCE  from SEWEBMASTER.SV_NO_NOISE_DATA  where STUDY_AREA = :strStudyArea and ROUND = :strStudyRound and BAND is not null and METRIC not in('LNIGHT_LOWEST','LDEN_LOWEST', 'LDAY','LOWEST') order by SOURCE ";
                }

                OracleDataReader dr = cmd.ExecuteReader();
                if (dr.HasRows)
                {
                    while (dr.Read())
                    {
                        string SOURCE;
                        if (!DBNull.Value.Equals(dr["SOURCE"]))
                        {
                            SOURCE = dr["SOURCE"].ToString();
                        }
                        else
                        {
                            SOURCE = "None";
                        }

                        studysourceDetail RecordMBR = new studysourceDetail(SOURCE);

                        resultList.Add(RecordMBR);
                    }
                }
                conn.Close();
                // return null;
                return resultList;
            }
            else
            {
                conn.Close();
                return null;
            }
        }
        catch (Exception ex)
        {
            throw new SoapException(String.Format("Error\n{0}", ex.Message), SoapException.ServerFaultCode);
        }
    }

    [System.Web.Services.WebMethod(Description = "Gets Study Area List")]
    [ScriptMethod(UseHttpGet = true)]
    public List<studyDetail> StudyDetails(String STUDY_AREA, String STUDY_SOURCE, String STUDY_ROUND)
    {
        try
        {
            if (GetDBConnection("sew01l_sdeuser"))
            {
                List<studyDetail> resultList = new List<studyDetail>();
                OracleCommand cmd = new OracleCommand();
                cmd.BindByName = false;
                cmd.Connection = conn;
                cmd.Parameters.Add("numLocationCode", OracleDbType.Varchar2).Value = STUDY_SOURCE;
                cmd.Parameters.Add("strLicenceNumber", OracleDbType.Varchar2).Value = STUDY_AREA;
                cmd.Parameters.Add("strStudyRound", OracleDbType.Varchar2).Value = STUDY_ROUND;
                cmd.CommandText = "SELECT distinct METRIC FROM SEWEBMASTER.SV_NO_NOISE_DATA where SOURCE = :numLocationCode AND STUDY_AREA = :strLicenceNumber and ROUND = :strStudyRound and METRIC not in('LNIGHT_LOWEST','LDEN_LOWEST', 'LDAY','LOWEST') order by METRIC ";


                OracleDataReader dr = cmd.ExecuteReader();
                if (dr.HasRows)
                {
                    while (dr.Read())
                    {
                        string METRIC;
                        if (!DBNull.Value.Equals(dr["METRIC"]))
                        {
                            METRIC = dr["METRIC"].ToString();
                        }
                        else
                        {
                            METRIC = "None";
                        }

                        studyDetail RecordMBR = new studyDetail(METRIC);

                        resultList.Add(RecordMBR);
                    }
                }
                conn.Close();
                // return null;
                return resultList;
            }
            else
            {
                conn.Close();
                return null;
            }
        }
        catch (Exception ex)
        {
            throw new SoapException(String.Format("Error\n{0}", ex.Message), SoapException.ServerFaultCode);
        }
    }

    [System.Web.Services.WebMethod(Description = "Search Extent")]
    [ScriptMethod(UseHttpGet = true)]
    public List<extent> SearchExtent(string searchTerm)
    {
        //searchTerm = searchTerm.ToUpper();

        if (GetDBConnection("sew01l_sdeuser"))
        {

            List<extent> resultList = new List<extent>();
            OracleCommand cmd = new OracleCommand();
            cmd.Parameters.Add("searchTerm", OracleDbType.Varchar2).Value = searchTerm;
            cmd.BindByName = false;
            cmd.Connection = conn;
            cmd.CommandText = "Select distinct DISPLAY_NAME, " +
                                "ROUND(sdo_geom.sdo_min_mbr_ordinate(SHAPE_POLYGON, 1)) XMIN, " +
                                "ROUND(sdo_geom.sdo_min_mbr_ordinate(SHAPE_POLYGON, 2)) YMIN, " +
                                "ROUND(sdo_geom.sdo_max_mbr_ordinate(SHAPE_POLYGON, 1)) XMAX,  " +
                                "ROUND(sdo_geom.sdo_max_mbr_ordinate(SHAPE_POLYGON, 2)) YMAX " +
                                "from SEWEBMASTER.SV_NO_STUDY_AREAS where DISPLAY_NAME = :searchTerm order by DISPLAY_NAME ";

            OracleDataReader dr = cmd.ExecuteReader();
            if (dr.HasRows)
            {
                while (dr.Read())
                {
                    String DISPLAY_NAME;
                    Int32 XMIN_1;
                    Int32 YMIN_1;
                    Int32 XMAX_1;
                    Int32 YMAX_1;

                    if (!DBNull.Value.Equals(dr["DISPLAY_NAME"]))
                    {
                        DISPLAY_NAME = dr["DISPLAY_NAME"].ToString();
                    }
                    else
                    {
                        DISPLAY_NAME = "Not Available";
                    }

                    if (!DBNull.Value.Equals(dr["XMIN"]))
                    {
                        XMIN_1 = Convert.ToInt32(dr["XMIN"]);
                    }
                    else
                    {
                        XMIN_1 = 0;
                    }
                    if (!DBNull.Value.Equals(dr["YMIN"]))
                    {
                        YMIN_1 = Convert.ToInt32(dr["YMIN"]);
                    }
                    else
                    {
                        YMIN_1 = 0;
                    }
                    if (!DBNull.Value.Equals(dr["XMAX"]))
                    {
                        XMAX_1 = Convert.ToInt32(dr["XMAX"]);
                    }
                    else
                    {
                        XMAX_1 = 0;
                    }
                    if (!DBNull.Value.Equals(dr["YMAX"]))
                    {
                        YMAX_1 = Convert.ToInt32(dr["YMAX"]);
                    }
                    else
                    {
                        YMAX_1 = 0;
                    }

                    extent RecordMBR = new extent(DISPLAY_NAME, XMIN_1, YMIN_1, XMAX_1, YMAX_1);

                    resultList.Add(RecordMBR);
                }
            }
            conn.Close();
            // return null;
            return resultList;
        }
        else
        {
            conn.Close();
            return null;
        }
    }

    protected Boolean GetDBConnection(String connectionName)
    {
        try
        {
            conn = new OracleConnection(GetConnectionString(connectionName));
            conn.Open();
            return true;
        }
        catch (Exception ex)
        {   // Raise SOAP exception if cannot connect to database. 
            // Potential to log first.
            //gisEvents.writeDBerror(ex.Message);
            throw new SoapException(String.Format("Error Connecting to Database\n{0}", ex.Message), SoapException.ServerFaultCode);

        }
    }

    private string GetConnectionString(string connectionName)
    {
        // Get the connectionStrings key,value pairs collection.
        ConnectionStringSettingsCollection connectionStrings =
            WebConfigurationManager.ConnectionStrings
            as ConnectionStringSettingsCollection;


        System.Configuration.ConnectionStringSettings connString;

        if (0 < connectionStrings.Count)
        {
            connString =
                connectionStrings[connectionName];
            if (null != connString)
                return connString.ConnectionString;
            else
            {
                string errorMsg = String.Format("Cannot Connect to Database. Connection string {0} not found in web.config", connectionName);
                //gisEvents.writeError(errorMsg);
                throw new SoapException(errorMsg, SoapException.ServerFaultCode);
            }

        }
        throw new SoapException(string.Format("Cannot Connect to Database \nConnection string {0} not found in web.config", connectionName), SoapException.ServerFaultCode);
    }

}


public class studysourceDetail
{

    public string SOURCE;

    public studysourceDetail()
    {
    }

    public studysourceDetail(string SOURCE2)
    {
        SOURCE = SOURCE2;
    }
}

public class studyareaDetail
{

    public string STUDY_AREA;

    public studyareaDetail()
    {
    }

    public studyareaDetail(string STUDY_AREA2)
    {
        STUDY_AREA = STUDY_AREA2;
    }
}

public class studyDetail
{

    public string METRIC;
    public string ROUND;

    public studyDetail()
    {
    }

    public studyDetail(string METRIC2)
    {
        METRIC = METRIC2;
    }
}

public class extent
{
    public String DISPLAY_NAME;
    public Int32 xmax;
    public Int32 ymax;
    public Int32 xmin;
    public Int32 ymin;

    public extent()
    {
    }

    public extent(String DISPLAY_NAME, Int32 xmin, Int32 ymin, Int32 xmax, Int32 ymax)
    {
        this.DISPLAY_NAME = DISPLAY_NAME;
        this.xmin = xmin;
        this.ymin = ymin;
        this.xmax = xmax;
        this.ymax = ymax;
    }

}