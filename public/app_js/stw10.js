var wid = 0;
var json_word = [];

function start_page()
{
	attach_menu();

	$$("jung_gun").setValue("2");
	$$("word_gun").setValue("100");

	today = get_today();
	$$("sdt").setValue(today);
	$$("edt").setValue(today);

	$$("radiobox_1").setValue(1);

	// read_list();
}

function get_check_sum()
{
	var check_sum = "";
	if ($$("check_kl").getValue())
	{
		check_sum = check_sum + "클리랑_주식,";
	}

	if ($$("check_ilbe").getValue())
	{
		check_sum = check_sum + "일베_주식,";
	}
	check_sum = check_sum + "종료문자";

	return check_sum;
}


function get_word_bun()
{
	// check_sum = get_check_sum();
	check_sum = "";

	var send_json = {
		"이상":$$("jung_gun").getValue(),
		"단어":$$("word_gun").getValue(),
		"시작일자":$$("sdt").getValue(),
		"종료일자":$$("edt").getValue(),
		"게시판": check_sum
	};
	$$("grid_1").clearAll();
	webix.ajax().headers({"Content-type":"application/json"}).post("/stw10/getWordBun", send_json, function(text)
	{
		var json_obj = JSON.parse(text);
		set_grid(text, $$('grid_1'));

		json_word = json_obj["data"];

		var url ="/stw11";
		var title = "title"+wid;
		wid = wid + 1;
		var status = "toolbar=no,directories=no,scrollbars=no,resizable=yes,status=no,menubar=no,width=1000, height=950, top=0,left=255, location=no"

		var open_windows_code = window.open(url, title, status);
	});
}

function get_word_gesi(p_id)
{
	// check_sum = get_check_sum();
	check_sum = "";

	var send_json = {
		"단어":$$('grid_1').getItem(p_id)["text"],
		"시작일자":$$("sdt").getValue(),
		"종료일자":$$("edt").getValue(),
		"게시판": check_sum
	};

	$$("grid_2").clearAll();
	webix.ajax().headers({"Content-type":"application/json"}).post("/stw10/getWordGesi", send_json, function(text)
	{
		set_grid(text, $$('grid_2'));
	});
}

function go_word_gesi(p_id)
{
	var url =$$('grid_2').getItem(p_id)["3"];
	var title = "title"+wid;
	wid = wid + 1;
	var status = "toolbar=no,directories=no,scrollbars=no,resizable=yes,status=no,menubar=no,width=1200, height=900, top=0,left=255, location=no"

	var open_windows_code = window.open(url, title, status);
}
