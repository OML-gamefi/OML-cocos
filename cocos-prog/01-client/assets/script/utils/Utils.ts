export default class Utils {
    public static StrFormat = function(str , strList)
    {
        for(var i=0;i<strList.length;i++)
        {
            if(str.indexOf("{" + i + "}") >= 0)
            {
                str = str.replace("{" + i + "}" , strList[i]);
            }
        }
        return str;
    }
}

window["Utils"] = Utils;

