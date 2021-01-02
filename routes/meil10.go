package routes

import (
	"fmt"
	"net/http"
	"net/url"

	"../mlib"

	"github.com/labstack/echo"
)

// GetMeil10 hhh
func GetMeil10(c echo.Context) error {
	return c.Render(http.StatusOK, "meil10.html", map[string]interface{}{
		"name": "mandu",
	})
}

// GetMeil11 hhh
func GetMeil11(c echo.Context) error {
	return c.Render(http.StatusOK, "meil11.html", map[string]interface{}{
		"name": "mandu",
	})
}

// GetMeil12 hhh
func GetMeil12(c echo.Context) error {
	return c.Render(http.StatusOK, "meil12.html", map[string]interface{}{
		"name": "mandu",
	})
}

// PostMeil10 hhh
func PostMeil10(c echo.Context) error {
	//rp := echo.Map{}
	rp := map[string]interface{}{}
	err := c.Bind(&rp)
	mlib.CheckErr(err)

	sqlText := ""
	switch c.Param("id") {
	case "getJong":

		formData := url.Values{
			"mk":          {"qhrhtlvek11!"},
			"server_type": {"demo"},
			"para":        {`{"para": { "exe_id":"query_jong"} }`},
		}

		// "para":        {"{\"para\": { \"exe_id\":\"query_jong\"} }"},
		body, err := mlib.ExePythonStock(formData)
		mlib.CheckErr(err)

		return c.String(http.StatusOK, string(body))

	case "getChartBasic":

		str_para := fmt.Sprintf(`{"para": { "exe_id":"query_chart_basic", "q_para":{"단축코드":"%s", "시작일자":"%s", "종료일자":"%s"} } }`,
			rp["단축코드"], rp["시작일자"], rp["종료일자"])

		formData := url.Values{
			"mk":          {"qhrhtlvek11!"},
			"server_type": {"demo"},
			"para":        {str_para},
		}

		body, err := mlib.ExePythonStock(formData)
		mlib.CheckErr(err)

		return c.String(http.StatusOK, string(body))

	case "getChart":

		str_para := fmt.Sprintf(`{"para": { "exe_id":"query_chart", "q_para":{"단축코드":"%s", "시작일자":"%s", "종료일자":"%s"} } }`,
			rp["단축코드"], rp["시작일자"], rp["종료일자"])

		formData := url.Values{
			"mk":          {"qhrhtlvek11!"},
			"server_type": {"demo"},
			"para":        {str_para},
		}

		body, err := mlib.ExePythonStock(formData)
		mlib.CheckErr(err)

		return c.String(http.StatusOK, string(body))

	case "saveMeilMaster":
		var sqlJo []interface{}
		if rp["일기순번"] == "새일기" {
			sqlText = `insert into 매매일기_마스터
						(일기순번, 구분, 단축코드, 종목명, 입력일자, 수정일자)
						values
						(
							(select sum(순번) from ( select max(일기순번) 순번 from 매매일기_마스터 union all select 1 ) 메인),
							$1,
							$2,
							$3,
							(select to_char(now(), 'YYYYMMDD')),
							(select to_char(now(), 'YYYYMMDD'))
						)
						returning 일기순번
						`
			sqlJo = mlib.MakeJo(rp["구분"], rp["단축코드"], rp["종목명"])
		} else {
			sqlText = `update 매매일기_마스터
						set 구분 = $1,
							단축코드 = $2,
							종목명 = $3,
							수정일자 = (select to_char(now(), 'YYYYMMDD'))
						where 일기순번 = $4
						returning 일기순번
						`
			sqlJo = mlib.MakeJo(rp["구분"], rp["단축코드"], rp["종목명"], rp["일기순번"])
		}

		rows, err := mlib.GetListJo(sqlText, sqlJo)
		mlib.CheckErr(err)
		return c.JSON(http.StatusOK, rows)

	case "saveMeilSub":
		var sqlJo []interface{}
		if rp["댓글순번"] == "새일기" {
			sqlText = `insert into 매매일기_서브
						(일기순번, 댓글순번, 입력일자, 수정일자, 내용1, 내용2, 매매구분, 매매수량, 매매일자, 단축코드, 종목명, 제목, 대분류, 중분류, 소분류)
						values
						(
							$1,
							(select sum(순번) from ( select max(댓글순번) 순번 from 매매일기_서브 where 일기순번 = $2 union all select 1 ) 메인),
							(select to_char(now(), 'YYYYMMDD')),
							(select to_char(now(), 'YYYYMMDD')),
							$3,
							$4,
							$5,
							$6,
							$7,
							$8,
							$9,
							$10,
							$11,
							$12,
							$13
						)
						returning 일기순번
						`
			sqlJo = mlib.MakeJo(rp["일기순번"], rp["일기순번"], rp["내용1"], rp["내용2"], rp["매매구분"], rp["매매수량"], rp["매매일자"], rp["단축코드"], rp["종목명"], rp["제목"], rp["대분류"], rp["중분류"], rp["소분류"])
		} else {
			sqlText = `update 매매일기_서브
						set 제목 = $1,
							대분류 = $2,
							중분류 = $3,
							소분류 = $4,
							내용1 = $5,
							내용2 = $6,
							매매구분 = $7,
							매매수량 = $8,
							매매일자 = $9,
							단축코드 = $10,
							종목명 = $11,
							수정일자 = (select to_char(now(), 'YYYYMMDD'))
						where 일기순번 = $12
						  and 댓글순번 = $13
						returning 일기순번
						`
			sqlJo = mlib.MakeJo(rp["제목"], rp["대분류"], rp["중분류"], rp["소분류"], rp["내용1"], rp["내용2"], rp["매매구분"], rp["매매수량"], rp["매매일자"], rp["단축코드"], rp["종목명"], rp["일기순번"], rp["댓글순번"])
		}

		rows, err := mlib.GetListJo(sqlText, sqlJo)
		mlib.CheckErr(err)
		return c.JSON(http.StatusOK, rows)

	case "getMeilMaster":
		sqlText = `select 일기순번, 단축코드, 종목명, 구분, 입력일자,
		                  (select count(댓글순번) from 매매일기_서브 where 일기순번 = 매매일기_마스터.일기순번) 댓글
		           from 매매일기_마스터 order by 입력일자, 종목명 desc`

		rows, err := mlib.GetList(sqlText)
		mlib.CheckErr(err)
		return c.JSON(http.StatusOK, rows)

	case "delMeilMaster":
		sqlText = `delete from 매매일기_마스터 where 일기순번 = $1`
		sqlJo := mlib.MakeJo(rp["일기순번"])
		_, err := mlib.GetListJo(sqlText, sqlJo)
		mlib.CheckErr(err)

		sqlText = `delete from 매매일기_서브 where 일기순번 = $1`
		sqlJo2 := mlib.MakeJo(rp["일기순번"])
		rows2, err2 := mlib.GetListJo(sqlText, sqlJo2)
		mlib.CheckErr(err2)

		return c.JSON(http.StatusOK, rows2)

	case "delMeilSub":
		sqlText = `delete from 매매일기_서브 where 일기순번 = $1 and 댓글순번 = $2`
		sqlJo := mlib.MakeJo(rp["일기순번"], rp["댓글순번"])
		rows, err := mlib.GetListJo(sqlText, sqlJo)
		mlib.CheckErr(err)

		return c.JSON(http.StatusOK, rows)

	case "getMeilSub":
		sqlText = `select 일기순번, 댓글순번, 단축코드, 종목명, 매매구분, 매매수량, 매매일자, 제목, 대분류, 중분류, 소분류, 입력일자, 수정일자, 내용1, 내용2
				   from 매매일기_서브
				   where 일기순번 = $1
				   order by 댓글순번 desc`

		sqlJo := mlib.MakeJo(rp["일기순번"])

		rows, err := mlib.GetListJo(sqlText, sqlJo)
		mlib.CheckErr(err)
		return c.JSON(http.StatusOK, rows)

	case "getMeilSubOne":
		sqlText = `select 일기순번, 댓글순번, 단축코드, 종목명, 매매구분, 매매수량, 매매일자, 제목, 대분류, 중분류, 소분류, 입력일자, 수정일자, 내용1, 내용2
				   from 매매일기_서브
				   where 일기순번 = $1
				     and 댓글순번 = $2
				   order by 댓글순번 desc`

		sqlJo := mlib.MakeJo(rp["일기순번"], rp["댓글순번"])

		rows, err := mlib.GetListJo(sqlText, sqlJo)
		mlib.CheckErr(err)
		return c.JSON(http.StatusOK, rows)

	default:
		sqlText = "1"
	}

	return c.String(http.StatusOK, sqlText)
}
