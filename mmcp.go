package main

import (
	"fmt"
	"html/template"
	"io"
	"net/http"
	_ "net/http/pprof"
	"runtime"

	"./mlib"
	"./routes"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/middleware"
)


// TemplateRenderer is a custom html/template renderer for Echo framework
type TemplateRenderer struct {
	templates *template.Template
}

// Render renders a template document
func (t *TemplateRenderer) Render(w io.Writer, name string, data interface{}, c echo.Context) error {

	// Add global methods if data is a map
	if viewContext, isMap := data.(map[string]interface{}); isMap {
		viewContext["reverse"] = c.Echo().Reverse
	}

	return t.templates.ExecuteTemplate(w, name, data)
}

func checkLogin(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		sess, _ := session.Get("session", c)

		mlib.JIJI(sess.Values["mmcpLogin"])

		if sess.Values["mmcpLogin"] == "mmcpLoginOk" {
			return next(c)
		}

		return c.Render(http.StatusOK, "login.html", map[string]interface{}{
			"name": "mandu",
		})
	}
}


func main() {
	runtime.GOMAXPROCS(2)
	//http.ListenAndServe(":8080", nil)

	e := echo.New()
	e.Pre(middleware.HTTPSRedirect())
	e.Use(middleware.Gzip())
	e.Use(session.Middleware(sessions.NewCookieStore([]byte("mmcpSession"))))
	e.Static("/public", "public")

	e.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
		Format: "method=${method}, uri=${uri}, status=${status}, header=${header}, query=${query}, form=${form}\n",
	}))

	renderer := &TemplateRenderer{
		templates: template.Must(template.ParseGlob("views/*.html")),
	}
	e.Renderer = renderer

	e.GET("/", routes.GetLogin)
	e.POST("/gogo", routes.PostGoLogin)

	e.GET("/memo10", routes.GetMemo10, checkLogin)
	e.POST("/memo10/:id", routes.PostMemo10, checkLogin)
	e.GET("/memo11", routes.GetMemo11, checkLogin)
	e.GET("/memo12", routes.GetMemo12, checkLogin)

	e.GET("/code10", routes.GetCode10, checkLogin)
	e.POST("/code10/:id", routes.PostCode10, checkLogin)
	e.GET("/code11", routes.GetCode11, checkLogin)

	e.GET("/novel10", routes.GetNovel10, checkLogin)
	e.POST("/novel10/:id", routes.PostNovel10, checkLogin)
	e.GET("/novel11", routes.GetNovel11, checkLogin)

	e.GET("/meil10", routes.GetMeil10, checkLogin)
	e.POST("/meil10/:id", routes.PostMeil10, checkLogin)

	e.GET("/stw10", routes.GetStw10, checkLogin)
	e.POST("/stw10/:id", routes.PostStw10, checkLogin)
	e.GET("/stw11", routes.GetStw11, checkLogin)

	mmcpConfig, err := mlib.GetConfig()
	mlib.CheckErr(err)

	e.Logger.Fatal(e.StartTLS(fmt.Sprintf(":%s", mmcpConfig["service_port"]), "./cert.pem", "./key.pem"))
}
