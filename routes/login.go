package routes

import (
	"net/http"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo"
	"github.com/labstack/echo-contrib/session"
)

// GetLogin hhh
func GetLogin(c echo.Context) error {
	return c.Render(http.StatusOK, "login.html", map[string]interface{}{
		"name": "mandu",
	})
}

// PostGoLogin hhh
func PostGoLogin(c echo.Context) error {

	sess, _ := session.Get("session", c)
	sess.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   86400 * 7,
		HttpOnly: true,
	}

	if c.FormValue("user") == "mandu" && c.FormValue("passwd") == "kokolplp" {
		sess.Values["mmcpLogin"] = "mmcpLoginOk"
		sess.Save(c.Request(), c.Response())
		return c.Redirect(http.StatusMovedPermanently, "/memo10")
	}

	sess.Values["mmcpLogin"] = "no"
	sess.Save(c.Request(), c.Response())
	return c.Redirect(http.StatusMovedPermanently, "/")
}
