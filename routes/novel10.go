package routes

import (
	"fmt"
	"net/http"

	"../mlib"
	"github.com/labstack/echo"
)

// GetNovel10 hhh
func GetNovel10(c echo.Context) error {
	return c.Render(http.StatusOK, "novel10.html", map[string]interface{}{
		"name": "mandu",
	})
}

// GetNovel11 hhh
func GetNovel11(c echo.Context) error {
	return c.Render(http.StatusOK, "novel11.html", map[string]interface{}{
		"name": "mandu",
	})
}

// PostNovel10 hhh
func PostNovel10(c echo.Context) error {
	//rp := echo.Map{}
	rp := map[string]interface{}{}
	err := c.Bind(&rp)
	mlib.CheckErr(err)

	sqlText := ""
	switch c.Param("id") {
	case "getListNovel1":
		sqlText = "select 문서번호 id, 구분1 s1, 구분1순서1 s2, 구분1순서2 s3, 구분1순서3||'.'||제목 \"value\", '1' gubun, 'last' dan from 소설 order by 구분1순서1, 구분1순서2, 구분1순서3"
		rows, err := mlib.GetList(sqlText)
		mlib.CheckErr(err)
		return c.JSON(http.StatusOK, rows)

	case "getListNovel2":
		sqlText = "select 문서번호 id, 구분2 s1, 구분2순서1 s2, 구분2순서2 s3, 구분2순서3||'.'||제목 \"value\", '2' gubun, 'last' dan  from 소설 order by 구분1순서1, 구분1순서2, 구분1순서3"
		rows, err := mlib.GetList(sqlText)
		mlib.CheckErr(err)
		return c.JSON(http.StatusOK, rows)

	case "getListNovel3":
		sqlText = "select 문서번호 id, 구분3 s1, 구분3순서3 s2, 구분3순서2 s3, 구분3순서3||'.'||제목 \"value\", '3' gubun, 'last' dan  from 소설 order by 구분1순서1, 구분1순서2, 구분1순서3"
		rows, err := mlib.GetList(sqlText)
		mlib.CheckErr(err)
		return c.JSON(http.StatusOK, rows)

	case "getListNovel4":
		sqlText = "select 문서번호 id, 구분4 s1, 구분4순서1 s2, 구분4순서2 s3, 구분4순서3||'.'||제목 \"value\", '4' gubun, 'last' dan  from 소설 order by 구분1순서1, 구분1순서2, 구분1순서3"
		rows, err := mlib.GetList(sqlText)
		mlib.CheckErr(err)
		return c.JSON(http.StatusOK, rows)

	case "getListNovel5":
		sqlText = "select 문서번호 id, 구분5 s1, 구분5순서1 s2, 구분5순서2 s3, 구분5순서3||'.'||제목 \"value\", '5' gubun, 'last' dan  from 소설 order by 구분1순서1, 구분1순서2, 구분1순서3"
		rows, err := mlib.GetList(sqlText)
		mlib.CheckErr(err)
		return c.JSON(http.StatusOK, rows)

	case "newNovel":
		sqlText = `insert into 소설
					(구분1, 구분1순서1, 구분1순서2, 구분1순서3, 입력일자)
					values
					($1, $2, $3, $4, to_char(now(), 'YYYY-MM-DD HH24:MI'))
                    returning 문서번호
					`
		sqlJo := mlib.MakeJo(rp["구분1"], rp["구분1순서1"], rp["구분1순서2"], rp["구분1순서3"])
		rows, err := mlib.GetListJo(sqlText, sqlJo)
		mlib.CheckErr(err)
		return c.JSON(http.StatusOK, rows)

	case "readNovel":
		sqlText =
			`select 문서번호, 제목, 내용1, 내용2,
                    구분1, 구분1순서1, 구분1순서2, 구분1순서3,
                    구분2, 구분2순서1, 구분2순서2, 구분2순서3,
                    구분3, 구분3순서1, 구분3순서2, 구분3순서3,
                    구분4, 구분4순서1, 구분4순서2, 구분4순서3,
                    구분5, 구분5순서1, 구분5순서2, 구분5순서3,
                    구분1||'.'||구분1순서1||'.'||구분1순서2||'.'||구분1순서3 순서1,
                    구분2||'.'||구분2순서1||'.'||구분2순서2||'.'||구분2순서3 순서2,
                    구분3||'.'||구분3순서1||'.'||구분3순서2||'.'||구분3순서3 순서3,
                    구분4||'.'||구분4순서1||'.'||구분4순서2||'.'||구분4순서3 순서4,
                    구분5||'.'||구분5순서1||'.'||구분5순서2||'.'||구분5순서3 순서5,
                    입력일자||'___'||수정일자 일자
			from 소설 where 문서번호 = $1`
		sqlJo := mlib.MakeJo(rp["문서번호"])
		rows, err := mlib.GetListJo(sqlText, sqlJo)
		mlib.CheckErr(err)
		return c.JSON(http.StatusOK, rows)

	case "saveNovel":
		sqlText = `update 소설
					set 내용1 = $1,
                        내용2 = $2,
                        수정일자 = to_char(now(), 'YYYY-MM-DD HH24:MI'),
                        제목 = $3
					where 문서번호 = $4
                    returning 문서번호
					`
		sqlJo := mlib.MakeJo(rp["내용1"], rp["내용2"], rp["제목"], rp["문서번호"])
		rows, err := mlib.GetListJo(sqlText, sqlJo)
		mlib.CheckErr(err)
		return c.JSON(http.StatusOK, rows)

	case "delNovel":
		sqlText = `delete from 소설
					where 문서번호 = $1
                    returning 문서번호
					`
		sqlJo := mlib.MakeJo(rp["문서번호"])
		rows, err := mlib.GetListJo(sqlText, sqlJo)
		mlib.CheckErr(err)
		return c.JSON(http.StatusOK, rows)

	case "moveNovel":
		sqlText = `update 소설
					set 구분1 = $1,
                        구분1순서1 = $2,
                        구분1순서2 = $3,
                        구분1순서3 = $4,
					    구분2 = $5,
                        구분2순서1 = $6,
                        구분2순서2 = $7,
                        구분2순서3 = $8,
					    구분3 = $9,
                        구분3순서1 = $10,
                        구분3순서2 = $11,
                        구분3순서3 = $12,
					    구분4 = $13,
                        구분4순서1 = $14,
                        구분4순서2 = $15,
                        구분4순서3 = $16,
					    구분5 = $17,
                        구분5순서1 = $18,
                        구분5순서2 = $19,
                        구분5순서3 = $20,
                        수정일자 = to_char(now(), 'YYYY-MM-DD HH24:MI')
					where 문서번호 = $21
                    returning 문서번호
					`
		sqlJo := mlib.MakeJo(rp["구분1"], rp["구분1순서1"], rp["구분1순서2"], rp["구분1순서3"],
			rp["구분2"], rp["구분2순서1"], rp["구분2순서2"], rp["구분2순서3"],
			rp["구분3"], rp["구분3순서1"], rp["구분3순서2"], rp["구분3순서3"],
			rp["구분4"], rp["구분4순서1"], rp["구분4순서2"], rp["구분4순서3"],
			rp["구분5"], rp["구분5순서1"], rp["구분5순서2"], rp["구분5순서3"],
			rp["문서번호"])
		rows, err := mlib.GetListJo(sqlText, sqlJo)
		mlib.CheckErr(err)
		return c.JSON(http.StatusOK, rows)

	case "moveDan":
		fmt.Printf("%s", rp["순서구분"])

		if fmt.Sprintf("%s", rp["순서구분"]) == "s1" {
			sqlText = `update 소설
					set 구분` + fmt.Sprintf("%s", rp["구분번호"]) + ` = $1
					where 구분` + fmt.Sprintf("%s", rp["구분번호"]) + ` = $2
					`
			sqlJo := mlib.MakeJo(rp["구분"], rp["구분"])

			mlib.JIJI(sqlText)
			mlib.JIJI(sqlJo)

			rows, err := mlib.GetListJo(sqlText, sqlJo)
			mlib.CheckErr(err)
			return c.JSON(http.StatusOK, rows)
		} else if fmt.Sprintf("%s", rp["순서구분"]) == "s2" {
			sqlText = `update 소설
					set 구분` + fmt.Sprintf("%s", rp["구분번호"]) + ` = $1,
                        구분` + fmt.Sprintf("%s", rp["구분번호"]) + `순서1 = $2,
                        구분` + fmt.Sprintf("%s", rp["구분번호"]) + `순서2 = $3
					where 구분` + fmt.Sprintf("%s", rp["구분번호"]) + ` = $4
                      and 구분` + fmt.Sprintf("%s", rp["구분번호"]) + `순서1 = $5
                      and 구분` + fmt.Sprintf("%s", rp["구분번호"]) + `순서2 = $6
					`
			sqlJo := mlib.MakeJo(rp["구분"], rp["순서1"], rp["순서2"],
				rp["구분"], rp["순서1"], rp["순서2"])

			mlib.JIJI(sqlText)
			mlib.JIJI(sqlJo)

			rows, err := mlib.GetListJo(sqlText, sqlJo)
			mlib.CheckErr(err)
			return c.JSON(http.StatusOK, rows)
		} else if fmt.Sprintf("%s", rp["순서구분"]) == "s3" {
			sqlText = `update 소설
					set 구분` + fmt.Sprintf("%s", rp["구분번호"]) + ` = $1,
                        구분` + fmt.Sprintf("%s", rp["구분번호"]) + `순서1 = $2,
                        구분` + fmt.Sprintf("%s", rp["구분번호"]) + `순서2 = $3,
                        구분` + fmt.Sprintf("%s", rp["구분번호"]) + `순서3 = $4
					where 구분` + fmt.Sprintf("%s", rp["구분번호"]) + ` = $5
                      and 구분` + fmt.Sprintf("%s", rp["구분번호"]) + `순서1 = $6
                      and 구분` + fmt.Sprintf("%s", rp["구분번호"]) + `순서2 = $7
                      and 구분` + fmt.Sprintf("%s", rp["구분번호"]) + `순서3 = $8
					`
			sqlJo := mlib.MakeJo(rp["구분"], rp["순서1"], rp["순서2"], rp["순서3"],
				rp["구분"], rp["순서1"], rp["순서2"], rp["순서3"])

			mlib.JIJI(sqlText)
			mlib.JIJI(sqlJo)

			rows, err := mlib.GetListJo(sqlText, sqlJo)
			mlib.CheckErr(err)
			return c.JSON(http.StatusOK, rows)
		} else {
			return c.JSON(http.StatusOK, `{"결과":"잉?"}`)
		}

	default:
		sqlText = "1"
	}

	return c.String(http.StatusOK, sqlText)
}
