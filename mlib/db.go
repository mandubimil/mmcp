package mlib

import (
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
)

var db *sql.DB

// MakeJo dd
func MakeJo(pParam ...interface{}) []interface{} {
	var rJo []interface{}
	rJo = make([]interface{}, len(pParam))

	for i, val := range pParam {
		rJo[i] = val
	}

	return rJo
}



// WR_OpenDb hhh
func OpenDb() {
	mmcpConfig, err := GetConfig()
	CheckErr(err)

	psqlInfo := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		mmcpConfig["hostIp"], mmcpConfig["port"], mmcpConfig["user"], mmcpConfig["password"], mmcpConfig["db"])

	JIJI(psqlInfo)


	db, err = sql.Open("postgres", psqlInfo)
	CheckErr(err)

	err = db.Ping()
	CheckErr(err)
}

// WR_GetList hhh
func GetList(sqlText string) ([]map[string]interface{}, error) {
	OpenDb()
	defer db.Close()

	rows, err := db.Query(sqlText)
	CheckErr(err)

	return getMapRow(rows), err
}

// GetListJo hhh
func GetListJo(sqlText string, sqlJo []interface{}) ([]map[string]interface{}, error) {
	OpenDb()
	defer db.Close()

	rows, err := db.Query(sqlText, sqlJo...)
	CheckErr(err)

	return getMapRow(rows), err
}

func getMapRow(rows *sql.Rows) []map[string]interface{} {
	cols, err := rows.Columns()
	CheckErr(err)

	res := make([]map[string]interface{}, 0)

	for rows.Next() {
		container := make([]interface{}, len(cols))
		dest := make([]interface{}, len(cols))
		for i, _ := range container {
			dest[i] = &container[i]
		}
		rows.Scan(dest...)
		r := make(map[string]interface{})
		for i, colname := range cols {
			val := dest[i].(*interface{})
			r[colname] = *val
		}
		res = append(res, r)
	}

	return res
}
