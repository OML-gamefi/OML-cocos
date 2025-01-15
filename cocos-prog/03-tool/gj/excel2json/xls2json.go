package main

import (
	"flag"
	"fmt"
	"os"
	"path"
	"regexp"
	"strconv"
	"strings"
	"unicode"

	//"github.com/qiuly/xlsx", 修复了一个关于文本显示格式的bug
	"github.com/tealeg/xlsx"
)

var infile *string = flag.String("i", "config.xlsx", "Excel file to be converted")
var outdir *string = flag.String("o", "./", "To which directory the JSON file will be output")
var outfile *string = new(string)

const HEADER_ROWS = 3
const COLCOMMENT_ROW = 0
const COLTYPE_ROW = 1
const COLNAME_ROW = 2
const CRLF_STR = "\r\n"
const TRIM_STR = " \r\n"

func main() {
	flag.Parse()
	if infile != nil {
		if outdir == nil {
			outdir = new(string)
			*outdir = "./"
		}
		tmpinfile := strings.Replace(*infile, "\\", "/", -1) //与Windows兼容
		filename := path.Base(tmpinfile)
		var filenamebase string
		for i := len(filename) - 1; i >= 0; i-- {
			if filename[i] == '.' {
				filenamebase = filename[:i]
			}
		}
		if filenamebase == "" {
			filenamebase = filename
		}
		if (*outdir)[len(*outdir)-1] != '/' && (*outdir)[len(*outdir)-1] != '\\' {
			*outdir += "/"
		}
		*outfile += *outdir + filenamebase + ".json"
		fmt.Println("infile =", *infile, "outfile =", *outfile)
	}

	excelFileName := *infile
	xlFile, error := xlsx.OpenFile(excelFileName)
	if error != nil {
		fmt.Println(error.Error())
		return
	}

	jsFile, err := os.Create(*outfile)
	if err != nil {
		fmt.Println("Failed to create the output file ", *outfile)
		return
	}
	defer jsFile.Close()

	//deal data
	for si, sheet := range xlFile.Sheets {
		if si != 0 { //Only deal first sheet
			break
		}
		if len(sheet.Rows) > HEADER_ROWS { //Output File Begin
			jsFile.WriteString("{")
		}
		num_row := 0
		colnames := make([]string, 0)
		coltypes := make([]string, 0)
		for ri, row := range sheet.Rows {
			if ri < HEADER_ROWS {
				if ri != 0 {
					for _, cell := range row.Cells {
						cellstr := strings.Trim(cell.String(), TRIM_STR)
						if ri == COLNAME_ROW {
							colnames = append(colnames, cellstr)
						} else if ri == COLTYPE_ROW {
							coltypes = append(coltypes, cellstr)
						}
					}
				}
				continue
			}

			if len(row.Cells) == 0 || strings.Trim(row.Cells[0].String(), TRIM_STR) == "" {
				continue
			}
			var rowstr string //Row Begin
			if num_row > 0 {
				rowstr += "," + CRLF_STR
			} else {
				rowstr += CRLF_STR
			}
			rowstr += "\"" + row.Cells[0].String() + "\":{"
			num_cell := 0
			for ci, cell := range row.Cells {
				cellval := strings.Trim(cell.String(), TRIM_STR)
				if cellval == "" || colnames[ci] == "" {
					continue
				}
				var cellstr string //Cell Begin
				if num_cell > 0 {
					cellstr += ","
				}
				cellstr += "\"" + colnames[ci] + "\":"
				switch strings.ToLower(coltypes[ci]) {
				case "int":
					if cellval == "" {
						cellval = "0"
					}
					cellstr += cellval
				case "number":
					fstr, _ := trimFloatString(cellval)
					cellstr += fstr
				case "string":
					ok, _ := regexp.MatchString(`^\d+\.\d+$`, cellval) //如果是'num.num'的浮点数格式
					if ok {
						cellval, _ = trimFloatString(cellval)
					}
					cellstr += "\"" + cellval + "\""
				case "bool":
					if cellval == "0" || cellval == "" || strings.ToLower(cellval) == "false" {
						cellstr += "false"
					} else {
						cellstr += "true"
					}
				case "intarray", "numberarray":
					isFieldSep := func(chr rune) bool { //空格,逗号和分号均可作为分隔符
						if unicode.IsSpace(chr) {
							return true
						}
						if chr == ',' || chr == ';' {
							return true
						}
						return false
					}
					fields := strings.FieldsFunc(cellval, isFieldSep)
					cellstr += "[" + strings.Join(fields, ",") + "]"
				default:
					cellstr += "\"" + cellval + "\""
				}
				rowstr += cellstr //Cell End
				num_cell++
			}
			rowstr += "}"     //Row End
			if num_cell > 1 { //row is not empty
				jsFile.WriteString(rowstr)
				num_row++
			}
		}
		if len(sheet.Rows) > HEADER_ROWS { //Output File End
			jsFile.WriteString(CRLF_STR + "}" + CRLF_STR)
		}
	}
}

//精确到小数点后5位，去掉末尾多余的0
func trimFloatString(valstr string) (trimstr string, ok bool) {
	trimstr = valstr
	fnum, err := strconv.ParseFloat(valstr, 64)
	if err != nil {
		fmt.Println("trimFloatString err: ", err)
		ok = false
		return
	}
	trimstr = strings.TrimRight(fmt.Sprintf("%.5f", fnum), "0") //末尾0
	if len(trimstr) >= 2 && trimstr[len(trimstr)-1] == '.' {    //末尾.
		trimstr = trimstr[:len(trimstr)-1]
	}
	return
}
