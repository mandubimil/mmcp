wi = 0;
select_button = "";
function start_page()
{
	attach_menu();
	read_list();
  read_code_go_memo();
  ctls();
  get_root_dir();
}

function add_list_work(p_id)
{
	let select_tree = $$('tree_1').getItem(p_id);
	$$('list_work').add({
		  "id": select_tree.id,
			"value": select_tree.value,
			"dirName": select_tree.dirName,
			"fileName": select_tree.fileName,
			"fullName": select_tree.fullName,
			"fType": select_tree.fType,
			}, 0
	);
}

function exec_command(p_command)
{
  $$("cm_command").setValue("exec....");

  p_command = $$("text_command").getValue();
  let send_json = {"명령어": p_command };

  if (p_command === '' || p_command === null || p_command === undefined)
  {
    webix.message("명령어를 입력하세요.");
    return 1;
  }

  webix.ajax().headers({"Content-type":"application/json"}).post("/code10/execCommand", send_json, function(text)
	{
    $$("cm_command").setValue(text);
    $$("text_command").setValue("");
	});
}

function exec_file()
{
  save_file();
  exec_file_name = $$('contents_1').풀경로;

  let mySplitResult = exec_file_name.split(".");
	let last_split = mySplitResult[mySplitResult.length-1];

  let send_json = {"언어":last_split, "실행파일": exec_file_name,};
  if (exec_file_name === '' || exec_file_name === null || exec_file_name === undefined)
  {
    webix.message("파일을 불러오신다음..");
    return 1;
  }

	$$("cm_run").setValue("");
	webix.ajax().headers({"Content-type":"application/json"}).post("/code10/execFile", send_json, function(text)
	{
    $$("cm_run").setValue(text);
	});
}

function new_dir(node)
{
  select_button = "dir";
  $$('pop_input').show($$("button_new_dir").getNode());
  $$("text_input").focus();
}

function new_dir_go()
{
  new_name = $$("label_curr_path").getValue()+$$("text_input").getValue();
  let send_json = {
    "생성이름": new_name,
  };
  if ($$("text_input").getValue() === '' || $$("text_input").getValue() === null || $$("text_input").getValue() === undefined)
  {
    webix.message("이름을 적어주세요.");
    return 1;
  }
	webix.ajax().headers({"Content-type":"application/json"}).post("/code10/newDir", send_json, function(text)
	{
    $$('label_curr_path').setValue(text);
    read_list();
	});
}

function new_file(node)
{
  select_button = "file";
  $$('pop_input').show($$("button_new_file").getNode());
  $$("text_input").focus();
}

function new_file_go()
{
  new_name = $$("label_curr_path").getValue()+$$("text_input").getValue();
  let send_json = {
    "생성이름": new_name,
  };
  if ($$("text_input").getValue() === '' || $$("text_input").getValue() === null || $$("text_input").getValue() === undefined)
  {
    webix.message("이름을 적어주세요.");
  }
	webix.ajax().headers({"Content-type":"application/json"}).post("/code10/newFile", send_json, function(text)
	{
    $$('label_curr_path').setValue(text);
    read_list();
	});
}

function get_root_dir()
{
  let send_json = {};
	webix.ajax().headers({"Content-type":"application/json"}).post("/code10/getRootDir", send_json, function(text)
	{
    $$('label_curr_path').setValue(text);
	});
}

function ctls()
{
  var isCtrl = false;
  document.onkeyup=function(e){
      if(e.which == 17) isCtrl=false;
  }

  document.onkeydown=function(e){
      if(e.which == 17) isCtrl=true;
      if(e.which == 83 && isCtrl == true) {
          //run code for CTRL+S -- ie, save!
          save_file();
          return false;
      }

      if(e.which == 13 && isCtrl == true) {
          //run code for CTRL+enter -- ie, open!
          exec_file()
          return false;
      }

      // if(e.which == 84 && isCtrl == true) {
      //     //run code for CTRL+T -- ie, new tab!
      //     return false;
      //}
  }
}

function clear_contents()
{
	//
}

function read_code_go_memo()
{
  let send_json = {};
	webix.ajax().headers({"Content-type":"application/json"}).post("/code10/getContentsCodeMemo", send_json, function(text)
	{
		var json_obj = JSON.parse(text);

		if (json_obj.length > 0)
		{
			$$('cm_memo').setValue(json_obj[0]["contents"]);
		}
	});
}

function save_file_memo()
{
  var send_json = { "내용":$$('cm_memo').getValue()};
	webix.ajax().headers({"Content-type":"application/json"}).post("/code10/saveCodeMemo", send_json, function(text)
	{
		webix.message(text);
	});
}

function read_list(select_id)
{
	var send_json = {};
	webix.ajax().headers({"Content-type":"application/json"}).post("/code10/getListCode", send_json, function(text)
	{
		var json_obj = JSON.parse(text);
		$$('contents_1').setValue(JSON.stringify(json_obj, null, "\t"));

		$$('tree_1').clearAll();
		$$('tree_1').parse(json_obj);
		$$('tree_1').sort('#id#');
		$$('tree_1').closeAll();

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

function read_code_go(send_json)
{
	webix.ajax().headers({"Content-type":"application/json"}).post("/code10/getContentsCode", send_json, function(text)
	{
		var json_obj = JSON.parse(text);

		if (json_obj.length > 0)
		{
			$$('label_file').setValue(json_obj[0]["dirName"]+json_obj[0]["fileName"]);
			$$('contents_1').setValue(json_obj[0]["contents"]);
			$$('contents_1').경로 = json_obj[0]["dirName"];
			$$('contents_1').파일 = json_obj[0]["fileName"];
			$$('contents_1').풀경로 = json_obj[0]["fullName"];
		}
	});
}

function read_code(fullName, fileName, dirName)
{
	let mySplitResult = fileName.split(".");
	let last_split = mySplitResult[mySplitResult.length-1];

	if (last_split === 'py')
		$$("contents_1").define({mode:"python"});
	else if (last_split === 'go')
		$$("contents_1").define({mode:"go"});
  else if (last_split === 'sql')
		$$("contents_1").define({mode:"query"});
	else
		$$("contents_1").define({mode:"javascript"});

  $$("contents_1")._render_cm_editor();

	var send_json = {"풀경로":fullName, "파일":fileName, "경로":dirName};
	if (last_split != 'go' && last_split != 'py' && last_split != 'js' && last_split != 'html' && last_split != 'txt' && last_split != 'sql' && last_split != 'ts')
	{
		webix.confirm({title:$$('contents_1').제목, text:"정말 불러?", callback:function(result)
		{
			if (result === true)
				read_code_go(send_json);
		}});
	}
	else
	{
		read_code_go(send_json);
	}
}

function read_code_go_cham(send_json)
{
	webix.ajax().headers({"Content-type":"application/json"}).post("/code10/getContentsCode", send_json, function(text)
	{
		var json_obj = JSON.parse(text);

		if (json_obj.length > 0)
		{
			$$('label_file_cham').setValue(json_obj[0]["dirName"]+json_obj[0]["fileName"]);
			$$('cm_cham').setValue(json_obj[0]["contents"]);
		}
	});
}

function read_code_cham(fullName, fileName, dirName)
{
	let mySplitResult = fileName.split(".");
	let last_split = mySplitResult[mySplitResult.length-1];

	if (last_split === 'py')
		$$("cm_cham").define({mode:"python"});
	else if (last_split === 'go')
		$$("cm_cham").define({mode:"go"});
  else if (last_split === 'sql')
		$$("cm_cham").define({mode:"query"});
	else
		$$("cm_cham").define({mode:"javascript"});

  $$("cm_cham")._render_cm_editor();

	var send_json = {"풀경로":fullName, "파일":fileName, "경로":dirName};
	if (last_split != 'go' && last_split != 'py' && last_split != 'js' && last_split != 'html' && last_split != 'txt' && last_split != 'sql')
	{
		webix.confirm({title:$$('contents_1').제목, text:"정말 불러?", callback:function(result)
		{
			if (result === true)
				read_code_go_cham(send_json);
		}});
	}
	else
	{
		read_code_go_cham(send_json);
	}
}

function save_file()
{
	var id = $$('contents_1').풀경로;

	if (id === '' || id === null || id === undefined)
	{
		webix.message('파일를 선택하세요.');
		return 1;
	}

	var send_json = { "풀경로":$$('contents_1').풀경로,
					  "내용":$$('contents_1').getValue()
					};

	webix.ajax().headers({"Content-type":"application/json"}).post("/code10/saveCode", send_json, function(text)
	{
		webix.message(text);
	});
}

// function ext_code()
// {
//
// 	let mySplitResult = $$('contents_1').풀경로.split(".");
// 	let last_split = mySplitResult[mySplitResult.length-1];
//
// 	if (last_split === 'sql')
// 	{
// 		if ($$("grid_1").$height == 1)
// 		{
// 		  $$("grid_1").define("height", 250);
// 		}
// 		else if ($$("grid_1").$height == 250)
// 		{
// 		  $$("grid_1").define("height", 500);
// 		}
// 		else if ($$("grid_1").$height == 500)
// 		{
// 		  $$("grid_1").define("height", 1);
// 		}
//
// 		$$("grid_1").resize();
// 		$$("contents_2").resize();
// 		$$("contents_2").define("height", 1);
// 	}
// 	else
// 	{
// 		if ($$("contents_2").$height == 1)
// 		{
// 		  $$("contents_2").define("height", 250);
// 		}
// 		else if ($$("contents_2").$height == 250)
// 		{
// 		  $$("contents_2").define("height", 500);
// 		}
// 		else if ($$("contents_2").$height == 500)
// 		{
// 		  $$("contents_2").define("height", 1);
// 		}
//
// 		$$("grid_1").resize();
// 		$$("contents_2").resize();
// 		$$("grid_1").define("height", 1);
// 	}
// }

function reload_code()
{
	var id = $$('contents_1').풀경로;

	if (id === '' || id === null || id === undefined)
	{
		webix.message('파일을 선택하세요.');
		return 1;
	}

	read_code($$('contents_1').풀경로 , $$('contents_1').파일, $$('contents_1').경로);
}

function del_code()
{
	webix.message("이거는 안할래");
}

function new_code(p_type)
{
	var send_json = { "경로":$$('label_curr_path').getValue(), "타입":p_type};

	webix.ajax().headers({"Content-type":"application/json"}).post("/code10/newCode", send_json, function(text)
	{
		webix.message(text);
		read_list();
	});
}

function rename_code(p_type)
{
	var id = $$('contents_1').풀경로;

	if (id === '' || id === null || id === undefined || $$('text_new').getValue() == '' || $$('text_new').getValue() == null )
	{
		webix.message('이름 넣어.');
		return 1;
	}

	var send_json = { "풀경로":$$('contents_1').풀경로, "경로":$$('contents_1').경로, "새파일이름":$$('text_new').getValue() };

	webix.ajax().headers({"Content-type":"application/json"}).post("/code10/renameCode", send_json, function(text)
	{
		webix.message(text);
		read_list();
	});
}


function open_windows_code()
{
    wi = wi + 1;
	var url ="/code11"
	var title = $$('label_file').getValue()+wi;
	var status = "toolbar=no,directories=no,scrollbars=no,resizable=yes,status=no,menubar=no,width=1000, height=950, top=0,left=255, location=no"

	var open_windows_code = window.open(url, title, status);
}

function run_code()
{
	full_name = $$('contents_1').풀경로;

	if (full_name == '' || full_name == null || full_name == undefined )
		return 1;

	let mySplitResult = full_name.split(".");
	let last_split = mySplitResult[mySplitResult.length-1];

	if (last_split == 'py' || last_split == 'go' || last_split == 'js')
	{
		var send_json = { "풀경로":full_name, "내용":$$('contents_1').getValue() };

		webix.ajax().headers({"Content-type":"application/json"}).post("/code10/saveCode", send_json, function(text)
		{
			var send_json = {"풀경로":full_name, "언어":last_split};
			webix.ajax().headers({"Content-type":"application/json"}).post("/code10/runCode", send_json, function(text)
			{
				webix.message("실행 완료~");
				$$('contents_2').setValue(text);
			});
		});
	}
	else if (last_split == 'sql')
	{
		var send_json = { "풀경로":full_name, "내용":$$('contents_1').getValue() };

		webix.ajax().headers({"Content-type":"application/json"}).post("/code10/saveQuery", send_json, function(text)
		{
			webix.ajax().headers({"Content-type":"application/json"}).post("/code10/runQuery", send_json, function(text)
			{
				var jsd = JSON.parse(text);

				if (jsd['check_result'] == 'error')
				{
					alert(jsd['error_message']);
				}
				else
				{
					$$('grid_1').clearAll();

					var col_name = [];
					for (var key in jsd['cols'])
						col_name[key] = {'id':key, 'header':jsd['cols'][key]}

					$$('grid_1').config.columns = col_name;
					$$('grid_1').refreshColumns();

					$$('grid_1').parse(jsd['rows']);

					for (var key in jsd['rows'][0])
						$$('grid_1').adjustColumn(key, 'all');
				}
			});
		});

	}
}
