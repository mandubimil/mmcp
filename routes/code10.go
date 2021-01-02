package routes

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"

	"../mlib"

	"github.com/labstack/echo"
)

// GetCode10 hhh
func GetCode10(c echo.Context) error {
	return c.Render(http.StatusOK, "code10.html", map[string]interface{}{
		"name": "mandu",
	})
}

// GetCode11 hhh
func GetCode11(c echo.Context) error {
	return c.Render(http.StatusOK, "code11.html", map[string]interface{}{
		"name": "mandu",
	})
}

// PostCode10 hhh
func PostCode10(c echo.Context) error {
	//rp := echo.Map{}
	rp := map[string]interface{}{}
	err := c.Bind(&rp)
	mlib.CheckErr(err)

	mmcpConfig, _ := mlib.GetConfig()
	mmcpDir := mmcpConfig["dir"].(string)

	sqlText := ""
	switch c.Param("id") {
  case "newDir":
    mlib.NewFileContents(rp["생성이름"].(string), "dir");

		return c.String(http.StatusOK, rp["생성이름"].(string))

  case "newFile":
    mlib.NewFileContents(rp["생성이름"].(string), "file");

		return c.String(http.StatusOK, rp["생성이름"].(string))

  case "getRootDir":
		return c.String(http.StatusOK, mmcpDir)

	case "getListCode":
		fileList, err := mlib.GetFileList(mmcpDir)
		mlib.CheckErr(err)

		return c.JSON(http.StatusOK, fileList)

	case "getContentsCode":
		rC, err := mlib.GetFileContents(rp["파일"].(string), rp["경로"].(string), rp["풀경로"].(string))
		mlib.CheckErr(err)

		return c.JSON(http.StatusOK, rC)

  case "getContentsCodeMemo":
		rC, err := mlib.GetFileContents("memo.txt", mmcpDir, mmcpDir+"/"+"memo.txt")
		mlib.CheckErr(err)

		return c.JSON(http.StatusOK, rC)

  case "saveCode":
		err := mlib.SaveFileContents(rp["풀경로"].(string), rp["내용"].(string))
		mlib.CheckErr(err)

		return c.JSON(http.StatusOK, "ok")

  case "saveCodeMemo":
		err := mlib.SaveFileContents(mmcpDir+"/"+"memo.txt", rp["내용"].(string))
		mlib.CheckErr(err)

		return c.JSON(http.StatusOK, "ok")

	case "newCode":
		err := mlib.NewFileContents(rp["경로"].(string)+"new", rp["타입"].(string))
		mlib.CheckErr(err)

		return c.JSON(http.StatusOK, "ok")

	case "renameCode":
		fmt.Println(rp["풀경로"], rp["경로"], rp["새파일이름"])
		err := mlib.RenameFileContents(rp["풀경로"].(string), rp["경로"].(string), rp["새파일이름"].(string))
		mlib.CheckErr(err)

		return c.JSON(http.StatusOK, "ok")

	case "execFile":
		cmdStr := "echo "
		switch rp["언어"] {
		case "go":
			cmdStr = "go run "
		case "py":
			cmdStr = "python3 "
		case "js":
			cmdStr = "node "
		default:
      cmdStr = "?"
		}

    if cmdStr == "무슨 파일이지요?" {
        return c.String(http.StatusOK, "?")
    }

    exeOut, err := mlib.ExeCmd(cmdStr + rp["실행파일"].(string))
		mlib.CheckErr(err)

		return c.String(http.StatusOK, exeOut)


  case "execCommand":
    mlib.JIJI(rp["명령어"].(string))
		exeOut, err := mlib.ExeCmd(rp["명령어"].(string))
		mlib.CheckErr(err)

		return c.String(http.StatusOK, exeOut)

	case "runQuery":
		resp, err := http.PostForm("http://192.168.0.112:3001/query_oracle",
			url.Values{"query_text": {rp["내용"].(string)}})

		mlib.CheckErr(err)

		data, err := ioutil.ReadAll(resp.Body)
		mlib.CheckErr(err)

		fmt.Printf(string(data))

		return c.String(http.StatusOK, string(data))

	default:
		sqlText = "없어"
		fmt.Println(mmcpDir)
	}

	return c.String(http.StatusOK, sqlText)
}
