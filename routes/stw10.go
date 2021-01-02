package routes

import (
	"fmt"
	"net/http"
	"net/url"

	"../mlib"

	"github.com/labstack/echo"
)

// GetStw10 hhh
func GetStw10(c echo.Context) error {
	return c.Render(http.StatusOK, "stw10.html", map[string]interface{}{
		"name": "mandu",
	})
}

// GetStw11 hhh
func GetStw11(c echo.Context) error {
	return c.Render(http.StatusOK, "stw11.html", map[string]interface{}{
		"name": "mandu",
	})
}

// PostStw10 hhh
func PostStw10(c echo.Context) error {
	//rp := echo.Map{}
	rp := map[string]interface{}{}
	err := c.Bind(&rp)
	mlib.CheckErr(err)

	sqlText := ""
	switch c.Param("id") {
	case "getWordBun":

		str_para := fmt.Sprintf(`{"para": { "exe_id":"get_word_bun", "q_para":{"이상":"%s", "단어":"%s", "시작일자":"%s", "종료일자":"%s", "게시판":"%s"} } }`,
			rp["이상"], rp["단어"], rp["시작일자"], rp["종료일자"], rp["게시판"])

		formData := url.Values{
			"mk":          {"qhrhtlvek11!"},
			"server_type": {"demo"},
			"para":        {str_para},
		}

		body, err := mlib.ExePythonStock(formData)
		mlib.CheckErr(err)

		return c.String(http.StatusOK, string(body))

	case "getWordGesi":

		str_para := fmt.Sprintf(`{"para": { "exe_id":"get_word_gesi", "q_para":{"단어":"%s", "시작일자":"%s", "종료일자":"%s", "게시판":"%s"} } }`,
			rp["단어"], rp["시작일자"], rp["종료일자"], rp["게시판"])

		formData := url.Values{
			"mk":          {"qhrhtlvek11!"},
			"server_type": {"demo"},
			"para":        {str_para},
		}

		body, err := mlib.ExePythonStock(formData)
		mlib.CheckErr(err)

		return c.String(http.StatusOK, string(body))

	default:
		sqlText = "1"
	}

	return c.String(http.StatusOK, sqlText)
}
