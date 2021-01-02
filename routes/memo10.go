package routes

import (
	"net/http"

	"../mlib"

	"github.com/labstack/echo"
)

// GetMemo10 hhh
func GetMemo10(c echo.Context) error {
	return c.Render(http.StatusOK, "memo10.html", map[string]interface{}{
		"name": "mandu",
	})
}

// GetMemo11 hhh
func GetMemo11(c echo.Context) error {
	return c.Render(http.StatusOK, "memo11.html", map[string]interface{}{
		"name": "mandu",
	})
}

// GetMemo12 hhh
func GetMemo12(c echo.Context) error {
	return c.Render(http.StatusOK, "memo12.html", map[string]interface{}{
		"name": "mandu",
	})
}

// PostMemo10 hhh
func PostMemo10(c echo.Context) error {
	//rp := echo.Map{}
	rp := map[string]interface{}{}
	err := c.Bind(&rp)
	mlib.CheckErr(err)

	sqlText := ""
	switch c.Param("id") {
	case "getListMemo":
		sqlText = "select 메모번호, 대분류, 'fd' 중분류, 소분류, 제목 from 메모 order by 대분류, 중분류, 소분류"
		rows, err := mlib.GetList(sqlText)
		mlib.CheckErr(err)
		return c.JSON(http.StatusOK, rows)

	case "getContentsMemo":
		sqlText = "select 메모번호, 대분류, 중분류, 소분류, 제목, 내용 from 메모 where 메모번호 = $1"
		sqlJo := mlib.MakeJo(rp["메모번호"])
		rows, err := mlib.GetListJo(sqlText, sqlJo)
		mlib.CheckErr(err)
		return c.JSON(http.StatusOK, rows)

	case "saveMemo":
		sqlText = `update 메모
					set 대분류 = $1,
						중분류 = $2,
						소분류 = $3,
						제목 = $4,
						내용 = $5
					where 메모번호 = $6
                    returning 메모번호
					`
		sqlJo := mlib.MakeJo(rp["대분류"], rp["중분류"], rp["소분류"], rp["제목"], rp["내용"], rp["메모번호"])
		rows, err := mlib.GetListJo(sqlText, sqlJo)
		mlib.CheckErr(err)
		return c.JSON(http.StatusOK, rows)

	case "delMemo":
		sqlText = `delete from 메모
					where 메모번호 = $1
                    returning 메모번호
					`
		sqlJo := mlib.MakeJo(rp["메모번호"])
		rows, err := mlib.GetListJo(sqlText, sqlJo)
		mlib.CheckErr(err)
		return c.JSON(http.StatusOK, rows)

	case "newMemo":
		sqlText = `insert into 메모
		            (메모번호, 대분류, 제목)
					values
					((select max(메모번호)+1 from 메모), $1, '새메모')
					returning 메모번호
					`
		sqlJo := mlib.MakeJo(rp["대분류"])

		rows, err := mlib.GetListJo(sqlText, sqlJo)
		mlib.CheckErr(err)
		return c.JSON(http.StatusOK, rows)

	default:
		sqlText = "1"
	}

	return c.String(http.StatusOK, sqlText)
}
