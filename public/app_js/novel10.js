wi = 0;
select_doc_id = '';
select_gubun = '';
num_tree = '';

function start_page()
{
    attach_menu();
    read_list();
}

function read_list_sub(p_tree, p_text, select_id)
{
	let json_obj = JSON.parse(p_text);
	let tree_data = [];
	
	for (let i=0 ; i <json_obj.length ; i++)
	{			
		tree_data[i] = {id:json_obj[i].메모번호, value:json_obj[i].순서, 순서:json_obj[i].순서, 구분1:json_obj[i].구분1, full_name:json_obj[i].s1};
	}

	json_obj.push( {id:9999, s1:"end", s2:"end", s3:"end"} );
	let td = create_tree_json(json_obj);
			
	p_tree.clearAll(); 
	p_tree.parse(td);
	p_tree.openAll();

	if ((select_id === undefined) || (select_id === null) || (select_id === ''))
	{
		//clear_contents();
	}
	else
	{
		p_tree.select(select_id);
		read_novel(select_id);
	}
}

function read_list(select_id)
{
	var send_json = {};	
	webix.ajax().headers({"Content-type":"application/json"}).post("/novel10/getListNovel1", send_json, function(text) { read_list_sub($$("tree_1"), text); } );		
	webix.ajax().headers({"Content-type":"application/json"}).post("/novel10/getListNovel2", send_json, function(text) { read_list_sub($$("tree_2"), text); } );		
	webix.ajax().headers({"Content-type":"application/json"}).post("/novel10/getListNovel3", send_json, function(text) { read_list_sub($$("tree_3"), text); } );		
	webix.ajax().headers({"Content-type":"application/json"}).post("/novel10/getListNovel4", send_json, function(text) { read_list_sub($$("tree_4"), text); } );		
	webix.ajax().headers({"Content-type":"application/json"}).post("/novel10/getListNovel5", send_json, function(text) { read_list_sub($$("tree_5"), text); } );		
}


function open_pop_new()
{
	$$("text_gubun1").setValue($$('contents_1').구분1);
	$$("text_gubun1_sunbun1").setValue($$('contents_1').구분1순서1);
	$$("text_gubun1_sunbun2").setValue($$('contents_1').구분1순서2);
	$$("text_gubun1_sunbun3").setValue($$('contents_1').구분1순서3);


	$$("pop_new").show($$("button_new").getNode());
}

function new_novel()
{
	var send_json = {   
                        "구분1":$$("text_gubun1").getValue(),
                        "구분1순서1":$$("text_gubun1_sunbun1").getValue(),
                        "구분1순서2":$$("text_gubun1_sunbun2").getValue(),
                        "구분1순서3":$$("text_gubun1_sunbun3").getValue(),
                    };

	webix.ajax().headers({"Content-type":"application/json"}).post("/novel10/newNovel", send_json, function(text)
	{		
		webix.message(text);
		var json_obj = JSON.parse(text);

		read_list(json_obj[0]["문서번호"]);
	});
}

function create_tree_json(p_data)
{
	var temp_data1 = [];
	var temp_data2 = [];
	var temp_data3 = [];
	var l_data = [];

	var s_check = [];
	var s_check_name = [];

	for (key in p_data)
	{
		if ( key>0 )
		{
			if ( s_check[1] != p_data[key]["s1"] )
			{
				temp_data3.push( {"value":s_check_name[3], "gubun":"s3", "dan":"s3", "data":l_data} );
				l_data = [];

				temp_data2.push( {"value":s_check_name[2], "gubun":"s2", "dan":"s2",  "data":temp_data3} );
				temp_data3 = [];

				temp_data1.push( {"value":s_check_name[1], "gubun":"s1", "dan":"s1",  "data":temp_data2} );
				temp_data2 = [];
			}
			else if ( s_check[2] != p_data[key]["s1"]+p_data[key]["s2"] )
			{
				temp_data3.push( {"value":s_check_name[3], "gubun":"s3", "dan":"s3",  "data":l_data} );
				l_data = [];

				temp_data2.push( {"value":s_check_name[2], "gubun":"s2", "dan":"s2",  "data":temp_data3} );
				temp_data3 = [];
			}
			else if ( s_check[3] != p_data[key]["s1"]+p_data[key]["s2"]+p_data[key]["s3"] )
			{
				temp_data3.push( {"value":s_check_name[3], "gubun":"s3", "dan":"s3",  "data":l_data} );
				l_data = [];
			}
		}

		l_data.push( p_data[key] );

		s_check[1] = p_data[key]["s1"];
		s_check[2] = p_data[key]["s1"]+p_data[key]["s2"];
		s_check[3] = p_data[key]["s1"]+p_data[key]["s2"]+p_data[key]["s3"];

		s_check_name[1] = p_data[key]["s1"];
		s_check_name[2] = p_data[key]["s2"];
		s_check_name[3] = p_data[key]["s3"];
	}

	return temp_data1;
}

function open_windows_novel(full_title)
{
	wi = wi + 1;
	var url ="/novel11"
	var title = full_title+"_"+wi;
	var status = "toolbar=no,directories=no,scrollbars=no,resizable=yes,status=no,menubar=no,width=1200, height=950, top=0,left=255, location=no"
	var open_windows_novel = window.open(url, title, status);
	open_windows_novel.onload = function() { this.document.title = title; }
}

function read_novel(p_doc_id, p_gubun)
{
	var send_json = {"문서번호":p_doc_id};
	webix.ajax().headers({"Content-type":"application/json"}).post("/novel10/readNovel", send_json, function(text)
	{
		var json_obj = JSON.parse(text);

		if (json_obj.length > 0)
		{
			$$('text_sun').setValue(json_obj[0]["순서"+p_gubun]);
			$$('text_title').setValue(json_obj[0]["제목"]);
			$$('text_day').setValue(json_obj[0]["일자"]);

			$$('contents_1').setValue(json_obj[0]["내용1"]);
			$$('contents_2').setValue(json_obj[0]["내용2"]);
			$$('contents_1').문서번호 = json_obj[0]["문서번호"];
			$$('contents_1').순서 = json_obj[0]["순서"+p_gubun];
			$$('contents_1').제목 = json_obj[0]["제목"];

			$$('contents_1').구분 = p_gubun;

			$$('contents_1').구분1 = json_obj[0]["구분1"];
			$$('contents_1').구분1순서1 = json_obj[0]["구분1순서1"];
			$$('contents_1').구분1순서2 = json_obj[0]["구분1순서2"];
			$$('contents_1').구분1순서3 = json_obj[0]["구분1순서3"];

			$$('contents_1').구분2 = json_obj[0]["구분2"];
			$$('contents_1').구분2순서1 = json_obj[0]["구분2순서1"];
			$$('contents_1').구분2순서2 = json_obj[0]["구분2순서2"];
			$$('contents_1').구분2순서3 = json_obj[0]["구분2순서3"];

			$$('contents_1').구분3 = json_obj[0]["구분3"];
			$$('contents_1').구분3순서1 = json_obj[0]["구분3순서1"];
			$$('contents_1').구분3순서2 = json_obj[0]["구분3순서2"];
			$$('contents_1').구분3순서3 = json_obj[0]["구분3순서3"];

			$$('contents_1').구분4 = json_obj[0]["구분4"];
			$$('contents_1').구분4순서1 = json_obj[0]["구분4순서1"];
			$$('contents_1').구분4순서2 = json_obj[0]["구분4순서2"];
			$$('contents_1').구분4순서3 = json_obj[0]["구분4순서3"];

			$$('contents_1').구분5 = json_obj[0]["구분5"];
			$$('contents_1').구분5순서1 = json_obj[0]["구분5순서1"];
			$$('contents_1').구분5순서2 = json_obj[0]["구분5순서2"];
			$$('contents_1').구분5순서3 = json_obj[0]["구분5순서3"];
		}
	});
}

function save_novel()
{
	let doc_id = $$('contents_1').문서번호;

	if (doc_id === '' || doc_id === null || doc_id === undefined)
	{
		webix.message('문서를 선택하세요.');
		return 1;
	}

	let send_json = { "문서번호":doc_id,
		"제목":$$('text_title').getValue(),
		"내용1":$$('contents_1').getValue(),
		"내용2":$$('contents_2').getValue()
	};

	webix.ajax().headers({"Content-type":"application/json"}).post("/novel10/saveNovel", send_json, function(text)
	{
		webix.message(text);

		opener.window.read_list(doc_id);
	});
}

function del_novel()
{
	let doc_id = $$('contents_1').문서번호;

	if (doc_id === '' || doc_id === null || doc_id === undefined)
	{
		webix.message('문서를 선택하세요.');
		return 1;
	}

	webix.confirm({title:$$('contents_1').순서+"  "+$$('contents_1').제목, text:"정말 지울껴?", callback:function(result)
	{
		let send_json = { "문서번호":doc_id};

		if (result === true)
			webix.ajax().headers({"Content-type":"application/json"}).post("/novel10/delNovel", send_json, function(text)
			{
				webix.message(text);
				opener.window.read_list();
				window.close();
			});
	}});
}

function open_pop_move()
{

	$$("text_gubun1").setValue($$('contents_1').구분1);
	$$("text_gubun1_sunbun1").setValue($$('contents_1').구분1순서1);
	$$("text_gubun1_sunbun2").setValue($$('contents_1').구분1순서2);
	$$("text_gubun1_sunbun3").setValue($$('contents_1').구분1순서3);

	$$("text_gubun2").setValue($$('contents_1').구분2);
	$$("text_gubun2_sunbun1").setValue($$('contents_1').구분2순서1);
	$$("text_gubun2_sunbun2").setValue($$('contents_1').구분2순서2);
	$$("text_gubun2_sunbun3").setValue($$('contents_1').구분2순서3);

	$$("text_gubun3").setValue($$('contents_1').구분3);
	$$("text_gubun3_sunbun1").setValue($$('contents_1').구분3순서1);
	$$("text_gubun3_sunbun2").setValue($$('contents_1').구분3순서2);
	$$("text_gubun3_sunbun3").setValue($$('contents_1').구분3순서3);

	$$("text_gubun4").setValue($$('contents_1').구분4);
	$$("text_gubun4_sunbun1").setValue($$('contents_1').구분4순서1);
	$$("text_gubun4_sunbun2").setValue($$('contents_1').구분4순서2);
	$$("text_gubun4_sunbun3").setValue($$('contents_1').구분4순서3);

	$$("text_gubun5").setValue($$('contents_1').구분5);
	$$("text_gubun5_sunbun1").setValue($$('contents_1').구분5순서1);
	$$("text_gubun5_sunbun2").setValue($$('contents_1').구분5순서2);
	$$("text_gubun5_sunbun3").setValue($$('contents_1').구분5순서3);

	$$("pop_move").show($$("button_move").getNode());
}

function move_novel()
{
	let doc_id = $$('contents_1').문서번호;

	if (doc_id === '' || doc_id === null || doc_id === undefined)
	{
		webix.message('문서를 선택하세요.');
		return 1;
	}

	let send_json = { "문서번호":doc_id,
		"구분1":$$('text_gubun1').getValue(),
		"구분1순서1":$$('text_gubun1_sunbun1').getValue(),
		"구분1순서2":$$('text_gubun1_sunbun2').getValue(),
		"구분1순서3":$$('text_gubun1_sunbun3').getValue(),
		"구분2":$$('text_gubun2').getValue(),
		"구분2순서1":$$('text_gubun2_sunbun1').getValue(),
		"구분2순서2":$$('text_gubun2_sunbun2').getValue(),
		"구분2순서3":$$('text_gubun2_sunbun3').getValue(),
		"구분3":$$('text_gubun3').getValue(),
		"구분3순서1":$$('text_gubun3_sunbun1').getValue(),
		"구분3순서2":$$('text_gubun3_sunbun2').getValue(),
		"구분3순서3":$$('text_gubun3_sunbun3').getValue(),
		"구분4":$$('text_gubun4').getValue(),
		"구분4순서1":$$('text_gubun4_sunbun1').getValue(),
		"구분4순서2":$$('text_gubun4_sunbun2').getValue(),
		"구분4순서3":$$('text_gubun4_sunbun3').getValue(),
		"구분5":$$('text_gubun5').getValue(),
		"구분5순서1":$$('text_gubun5_sunbun1').getValue(),
		"구분5순서2":$$('text_gubun5_sunbun2').getValue(),
		"구분5순서3":$$('text_gubun5_sunbun3').getValue(),
	};

	webix.ajax().headers({"Content-type":"application/json"}).post("/novel10/moveNovel", send_json, function(text)
	{
		webix.message(text);
		opener.window.read_list(doc_id);

		$$('contents_1').구분1 = $$('text_gubun1').getValue();
		$$('contents_1').구분1순서1 = $$('text_gubun1_sunbun1').getValue();
		$$('contents_1').구분1순서2 = $$('text_gubun1_sunbun2').getValue();
		$$('contents_1').구분1순서3 = $$('text_gubun1_sunbun3').getValue();

		$$('contents_1').구분2 = $$('text_gubun2').getValue();
		$$('contents_1').구분2순서1 = $$('text_gubun2_sunbun1').getValue();
		$$('contents_1').구분2순서2 = $$('text_gubun2_sunbun2').getValue();
		$$('contents_1').구분2순서3 = $$('text_gubun2_sunbun3').getValue();

		$$('contents_1').구분3 = $$('text_gubun3').getValue();
		$$('contents_1').구분3순서1 = $$('text_gubun3_sunbun1').getValue();
		$$('contents_1').구분3순서2 = $$('text_gubun3_sunbun2').getValue();
		$$('contents_1').구분3순서3 = $$('text_gubun3_sunbun3').getValue();

		$$('contents_1').구분4 = $$('text_gubun4').getValue();
		$$('contents_1').구분4순서1 = $$('text_gubun4_sunbun1').getValue();
		$$('contents_1').구분4순서2 = $$('text_gubun4_sunbun2').getValue();
		$$('contents_1').구분4순서3 = $$('text_gubun4_sunbun3').getValue();

		$$('contents_1').구분5 = $$('text_gubun5').getValue();
		$$('contents_1').구분5순서1 = $$('text_gubun5_sunbun1').getValue();
		$$('contents_1').구분5순서2 = $$('text_gubun5_sunbun2').getValue();
		$$('contents_1').구분5순서3 = $$('text_gubun5_sunbun3').getValue();
	});
}

function move_dan()
{
	let send_json = { "구분번호":num_tree,"순서구분":$$("tree_1").getItem($$("tree_1").getSelectedId()).dan,
		"구분":$$('text_gubun').getValue(),
		"순서1":$$('text_gubun_sunbun1').getValue(),
		"순서2":$$('text_gubun_sunbun2').getValue(),
		"순서3":$$('text_gubun_sunbun3').getValue(),
	};

	// webix.ajax().headers({"Content-type":"application/json"}).post("/novel10/moveDan", send_json, function(text)
	// {
	// 	webix.message(text);
	//
	// 	opener.window.read_list(doc_id);
	// });
}

function ext_novel()
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