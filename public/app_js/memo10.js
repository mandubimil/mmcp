wi = 0;
state_left_window = true;

function start_page()
{
  attach_menu();
  ctls();
	read_list();
}

function ctls()
{
  var isCtrl = false;
  document.onkeyup=function(e){
      if(e.which == 17) isCtrl=false;
  }

  document.onkeydown=function(e){
      // webix.message(e.which)
      if(e.which == 17) isCtrl=true;

      if(e.which == 83 && isCtrl == true) {
          //run code for CTRL+S -- ie, save!
          save_memo();
          return false;
      }
      else if (e.which == 81 && isCtrl == true) {
        if (state_left_window)
        {
          $$("left_window").hide();
          state_left_window = false;
        }
        else
        {
          $$("left_window").show();
          state_left_window = true;
        }
      }
  }
}

function clear_contents()
{
	$$('text_title').setValue("");
	$$('text_b1').setValue("");
	$$('text_b2').setValue("");
	$$('text_b3').setValue("");
	$$('contents_1').setValue("");
	$$('contents_1').메모번호 = "";
	$$('contents_1').제목 = "";
}

function read_list(select_id)
{
	var send_json = {};
	webix.ajax().headers({"Content-type":"application/json"}).post("/memo10/getListMemo", send_json, function(text)
	{
		var json_obj = JSON.parse(text);
		var tree_data = [];

		for (var i=0 ; i <json_obj.length ; i++)
		{
			tree_data[i] = {id:json_obj[i].메모번호, value:json_obj[i].제목, 제목:json_obj[i].제목, 대분류:json_obj[i].대분류, 중분류:json_obj[i].중분류};
		}

		$$('tree_1').clearAll();
		$$('tree_1').parse(tree_data);
		$$('tree_1').sort('#value#');
		$$('tree_1').openAll();

		if ((select_id === undefined) || (select_id === null) || (select_id === ''))
		{
			clear_contents();
		}
		else
		{
			$$('tree_1').select(select_id);
		}
	});
}

function read_memo(id)
{
    var send_json = {"메모번호":id};
	webix.ajax().headers({"Content-type":"application/json"}).post("/memo10/getContentsMemo", send_json, function(text)
	{
		var json_obj = JSON.parse(text);

		if (json_obj.length > 0)
		{
			$$('statebar1').setHTML(json_obj[0]["대분류"]);
			$$('statebar1').대분류 = json_obj[0]["대분류"];
			$$('text_title').setValue(json_obj[0]["제목"]);
			$$('text_b1').setValue(json_obj[0]["대분류"]);
			$$('text_b2').setValue(json_obj[0]["중분류"]);
			$$('text_b3').setValue(json_obj[0]["소분류"]);
			$$('contents_1').setValue(json_obj[0]["내용"]);
			$$('contents_1').메모번호 = json_obj[0]["메모번호"];
			$$('contents_1').제목 = json_obj[0]["제목"];
		}
	});
}


function read_memo_print(id)
{
    var send_json = {"메모번호":id};
	webix.ajax().headers({"Content-type":"application/json"}).post("/memo10/getContentsMemo", send_json, function(text)
	{
		var json_obj = JSON.parse(text);

		if (json_obj.length > 0)
		{
			$$('content').setHTML(json_obj[0]["내용"]);
		}
	});
}

function save_memo(sub_windows)
{
	var id = $$('contents_1').메모번호;

	if (id === '' || id === null || id === undefined)
	{
		webix.message('메모를 선택하세요.');
		return 1;
	}

	var send_json = { "메모번호":id,
				  	  "제목":$$('text_title').getValue(),
					  "대분류":$$('text_b1').getValue(),
					  "중분류":$$('text_b2').getValue(),
					  "소분류":$$('text_b3').getValue(),
					  "내용":$$('contents_1').getValue()
					};

	webix.ajax().headers({"Content-type":"application/json"}).post("/memo10/saveMemo", send_json, function(text)
	{
		webix.message(text);
	});
}

function ext_memo()
{
    if ($$("contents_2").$height > 1)
    {
      $$("contents_2").define("height", 1);
    }
    else
    {
      $$("contents_2").define("height", 300);
    }

    $$("contents_2").resize();
}

function del_memo()
{
	var id = $$('contents_1').메모번호;

	if (id === '' || id === null || id === undefined)
	{
		webix.message('메모를 선택하세요.');
		return 1;
	}

	webix.confirm({title:$$('contents_1').제목, text:"정말 지울껴?", callback:function(result)
	{
		var send_json = { "메모번호":id};

		if (result === true)
			webix.ajax().headers({"Content-type":"application/json"}).post("/memo10/delMemo", send_json, function(text)
			{
				webix.message(text);
				read_list();
			});
	}});
}

function new_memo()
{
	var send_json = { "대분류":$$('statebar1').대분류};

	webix.ajax().headers({"Content-type":"application/json"}).post("/memo10/newMemo", send_json, function(text)
	{
		webix.message(text);
		var json_obj = JSON.parse(text);

		read_list(json_obj[0]["메모번호"]);
	});
}

function open_windows_memo()
{
    wi = wi + 1;
	var url ="/memo11"
	var title = $$('text_title').getValue()+wi;
	var status = "toolbar=no,directories=no,scrollbars=no,resizable=yes,status=no,menubar=no,width=1000, height=950, top=0,left=255, location=no"

	var open_windows_memo = window.open(url, title, status);
}

function open_windows_print()
{
    wi = wi + 1;
	var url ="/memo12"
	var title = $$('text_title').getValue()+wi;
	var status = "toolbar=no,directories=no,scrollbars=no,resizable=yes,status=no,menubar=no,width=1000, height=950, top=0,left=255, location=no"

	var open_windows_memo = window.open(url, title, status);
}
