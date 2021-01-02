function start_page()
{
  	attach_menu();
	read_jong();
	read_list();
	read_list_gubun();
    
    $$('text_meil_num').disable();
    $$('text_jong_code').disable();
	$$('text_jong_name').disable();

	$$('text_meil_sub_num').disable();
	
	disable_edit();
}

function enable_edit()
{
	$$('button_update').show();
	$$('button_add').show();
	$$('chart_frame').show();
}

function disable_edit()
{
	$$('button_update').hide();
	$$('button_add').hide();
	$$('chart_frame').hide();
}

function clear_select()
{
	$$("meil_info").setHTML("");
	disable_edit();
}

function read_list()
{
	var send_json = {};	
	webix.ajax().headers({"Content-type":"application/json"}).post("/meil10/getMeilMaster", send_json, function(text)
	{  
		var json_obj = JSON.parse(text);		
		var tree_data = [];
		
		for (var i=0 ; i <json_obj.length ; i++)
		{			
			tree_data[i] = {id:json_obj[i].일기순번, 
				value:format_date(json_obj[i].입력일자)+" <b>"+json_obj[i].종목명+"</b> "+json_obj[i].댓글, 
				단축코드:json_obj[i].단축코드, 
				종목명:json_obj[i].종목명,
				구분:json_obj[i].구분,
				입력일자:json_obj[i].입력일자
			};
		}		

		$$('tree_1').clearAll(); 
		$$('tree_1').parse(tree_data);		
		$$('tree_1').sort('입력일자');
		$$('tree_1').openAll();

		$$('tree_2').clearAll(); 
		$$('tree_2').parse(tree_data);		
		$$('tree_2').sort('종목명');
		$$('tree_2').openAll();
	});
}

function read_list_gubun()
{
	var send_json = {};	
	webix.ajax().headers({"Content-type":"application/json"}).post("/meil10/getMeilMaster", send_json, function(text)
	{  
		var json_obj = JSON.parse(text);		
		var tree_data = [];
		
		for (var i=0 ; i <json_obj.length ; i++)
		{			
			tree_data[i] = {id:json_obj[i].일기순번, 
				value:json_obj[i].구분+" <b>"+json_obj[i].종목명+"</b>", 
				단축코드:json_obj[i].단축코드, 
				종목명:json_obj[i].종목명,
				구분:json_obj[i].구분,
				입력일자:json_obj[i].입력일자,
			};
		}		

		$$('tree_3').clearAll(); 
		$$('tree_3').parse(tree_data);		
		$$('tree_3').sort('구분', "desc");
		$$('tree_3').openAll();
	});
}

function read_jong()
{
	var send_json = {};	
	webix.ajax().headers({"Content-type":"application/json"}).post("/meil10/getJong", send_json, function(text)
	{  
        set_grid_python_select(text, $$('grid_jong'));                    
	});		
}

function open_meil_edit_windows()
{
	$$("text_meil_num").setValue("새일기");

	$$("text_jong_code").setValue("");
	$$("text_jong_name").setValue("");
	$$("text_gubun").setValue("");
	$$("text_jong_search").setValue("");

	$$("meil_edit").show({x:100, y:50});
}

function open_meil_edit_windows_update()
{
	$$("text_meil_num").setValue($$('chart_1').일기순번);

	$$("text_jong_code").setValue($$('chart_1').단축코드);
	$$("text_jong_name").setValue($$('chart_1').종목명);
	$$("text_gubun").setValue($$('chart_1').구분);
	$$("text_jong_search").setValue("");

	$$("meil_edit").show({x:100, y:50});
}

function open_meil_sub_edit_windows()
{
	$$("contents_1").setValue("");
	$$("contents_2").setValue("");
	$$("contents_1").일기순번 = $$("chart_1").일기순번;

	
	$$("text_meil_sub_num").setValue("새일기");
	$$("text_je").setValue("");
	$$("text_de").setValue("");
	$$("text_jung").setValue("");
	$$("text_so").setValue("");
	
	$$("text_jong_code_2").setValue($$("chart_1").단축코드);
	$$("text_jong_name_2").setValue($$("chart_1").종목명);
	
	$$("text_meme_day").setValue("");
	$$("text_meme_gubun").setValue("");
	$$("text_meme_su").setValue("");

	$$("meil_sub_edit").show({x:200, y:300});

	$$("meil_sub_info").setHTML("["+$$("chart_1").일기순번+"] "+$$("chart_1").단축코드+" <b>"+$$("chart_1").종목명+"</b> "+format_date($$("chart_1").입력일자));
}

function save_meil_mastser()
{
	var send_json = 
	{
		"일기순번": $$("text_meil_num").getValue(),
		"구분": $$("text_gubun").getValue(),
		"단축코드": $$("text_jong_code").getValue(),
		"종목명": $$("text_jong_name").getValue(),
	};	
	webix.ajax().headers({"Content-type":"application/json"}).post("/meil10/saveMeilMaster", JSON.stringify(send_json), function(text)
	{  
		webix.message(text);
		$$("meil_edit").hide();

		let meil_num = JSON.parse(text)[0]["일기순번"];

		getPromise(1)
		.then(read_list())
		.then(read_list_gubun())
		.then(get_meil_sub_chart(meil_num))
		.then(get_meil_sub_content(meil_num));
	});
}

function save_meil_sub()
{
	var send_json = 
	{
		"일기순번": $$("contents_1").일기순번,
		"댓글순번": $$("text_meil_sub_num").getValue(),
		"제목": $$("text_je").getValue(),
		"대분류": $$("text_de").getValue(),
		"중분류": $$("text_jung").getValue(),
		"소분류": $$("text_so").getValue(),
		"내용1": $$("contents_1").getValue(),
		"내용2": $$("contents_2").getValue(),
		"단축코드": $$("text_jong_code_2").getValue(),
		"종목명": $$("text_jong_name_2").getValue(),
		"매매일자": $$("text_meme_day").getValue(),
		"매매구분": $$("text_meme_gubun").getValue(),
		"매매수량": $$("text_meme_su").getValue(),
	};	
	webix.ajax().headers({"Content-type":"application/json"}).post("/meil10/saveMeilSub", JSON.stringify(send_json), function(text)
	{  
		webix.message(text);
		$$("meil_sub_edit").hide();

		let meil_num = JSON.parse(text)[0]["일기순번"];

		getPromise(1)
		.then(read_list())
		.then(read_list_gubun())
		.then(get_meil_sub_chart(meil_num))
		.then(get_meil_sub_content(meil_num));
	});
}

function del_meil_master()
{
	webix.confirm({title:$$("chart_1").일기순번, text:"정말 지울껴?", callback:function(result)
	{
		var send_json = {"일기순번": $$("chart_1").일기순번,};	
	
		if (result === true)
			webix.ajax().headers({"Content-type":"application/json"}).post("/meil10/delMeilMaster", send_json, function(text)
			{
				webix.message(text);

				$$("meil_edit").hide();
				read_list();
				read_list_gubun();
				clear_select();
			});	
	}});
}


function get_meil_sub_chart(p_id)
{
	if (($$("tree_1").getItem(p_id).단축코드 == undefined) || ($$("tree_1").getItem(p_id).단축코드==""))
	{
		enable_edit();
		$$("meil_info").setHTML($$("tree_1").getItem(p_id).구분+" "+$$("tree_1").getItem(p_id).단축코드+" <b>"+$$("tree_1").getItem(p_id).종목명+"</b> "+format_date($$("tree_1").getItem(p_id).입력일자));
		$$('chart_frame').hide();

		$$('chart_1').일기순번 = $$("tree_1").getItem(p_id).id;
		$$('chart_1').단축코드 = $$("tree_1").getItem(p_id).단축코드;
		$$('chart_1').종목명 = $$("tree_1").getItem(p_id).종목명;
		$$('chart_1').구분 = $$("tree_1").getItem(p_id).구분;
		$$('chart_1').입력일자 = $$("tree_1").getItem(p_id).입력일자;

		return 1;
		//여기가 좀 애매하게 만들어졌네.. 고치기 귀찬아..
	}

	sday = get_pm_mon($$("tree_1").getItem(p_id).입력일자, -3);
	eday = get_today();

	var send_json = {
		"단축코드": $$("tree_1").getItem(p_id).단축코드,
		"시작일자": sday,
		"종료일자": eday,
	};	
	webix.ajax().headers({"Content-type":"application/json"}).post("/meil10/getChartBasic", send_json, function(text)
	{  
		var jsd = JSON.parse(text)["rows"];

		let temp_str =
		'<b>'+jsd[0][0]+'</b> <br><b>'+jsd[0][1]+"</b><p>"+
		format_date(sday)+' ~ '+format_date(eday)+
		'</b> <p>시가총액:<b>'+comma1000(jsd[0][2])+'</b>'+
		'<br>상장주식:<b>'+comma1000(jsd[0][3])+'</b>'+
		'<p>최고 주가:<b>'+comma1000(jsd[0][10])+'</b>'+
		'<br>최저 주가:<b>'+comma1000(jsd[0][9])+'</b>'+
		'<p>52주 최고:<b>'+comma1000(jsd[0][6])+'</b>'+
		'<br>52주 최저:<b>'+comma1000(jsd[0][7])+'</b>'+
		'<p>외국인 보유:<b>'+comma1000(jsd[0][8])+'</b>'+
		'<br>per:<b>'+comma1000(jsd[0][4])+'</b>'+
		'<br>pbr:<b>'+comma1000(jsd[0][5])+'</b>'+
		'<br>최고/최저:<b>'+  Math.round(((jsd[0][10]-jsd[0][9])/jsd[0][10])*100)+'%</b>';

		$$('tms2').setHTML(temp_str);

        let max_p = parseInt(jsd[0][10]);
        let min_p = parseInt(jsd[0][9]);
        let step_10 = parseInt((max_p - min_p) / 10);
        var max_g = parseInt(jsd[0][16]);

        $$("chart_1").removeAllSeries();
        $$("chart_1").addSeries({  type:"line", value:"#data1#", color:"#36abee", item:{ radius:0 }, 
                                    line:{ color:"#1293f8", width:3 },
                                    yAxis:{ lineColor:"#cccccc", start:min_p, end:max_p, step:step_10 },
                                    xAxis:{ template: "#data3#", lines: false }
                                });

        $$("chart_1").addSeries({  type:"line", value:"#data4#", color:"#eeeeee", item:{ radius:0 }, 
                                line:{ color:"#de619c", width:1 },
                                yAxis:{ start:min_p, end:max_p, step:step_10 },
                                xAxis:{ template: "#data3#", lines: false }
                            });
                            
        $$("chart_1").addSeries({  type:"line", value:"#data5#", color:"#eeeeee", item:{ radius:0 }, 
                                line:{ color:"#ff8c00", width:1 },
                                yAxis:{ start:min_p, end:max_p, step:step_10 },
                                xAxis:{ template: "#data3#", lines: false }
                            });

        $$("chart_2").removeAllSeries();
        $$("chart_2").addSeries({  type:"bar", value:"#data2#", color:"#aaaaaa", item:{ radius:0 }, 
                                    yAxis:{ start:0, end:max_g, step:Math.round(max_g/3) },
                                    xAxis:{ template: "#data3#", lines: false }
                                });		

        webix.ajax().headers({"Content-type":"application/json"}).post("/meil10/getChart", send_json, function(text2)
        {  
			var jsd2 = JSON.parse(text2)["rows"];
			
            $$('chart_1').clearAll(); 
			$$("chart_1").define("data", JSON.stringify(jsd2));            

            $$('chart_2').clearAll(); 
			$$("chart_2").define("data", JSON.stringify(jsd2));  
			
			enable_edit();

			$$("meil_info").setHTML($$("tree_1").getItem(p_id).구분+" "+$$("tree_1").getItem(p_id).단축코드+" <b>"+$$("tree_1").getItem(p_id).종목명+"</b> "+format_date($$("tree_1").getItem(p_id).입력일자));

			$$('chart_1').일기순번 = $$("tree_1").getItem(p_id).id;
			$$('chart_1').단축코드 = $$("tree_1").getItem(p_id).단축코드;
			$$('chart_1').종목명 = $$("tree_1").getItem(p_id).종목명;
			$$('chart_1').구분 = $$("tree_1").getItem(p_id).구분;
			$$('chart_1').입력일자 = $$("tree_1").getItem(p_id).입력일자;
        });     		
	});		
}

function get_meil_sub_content(p_id)
{
	var send_json = {
		"일기순번": $$("tree_1").getItem(p_id).id
	};	
	webix.ajax().headers({"Content-type":"application/json"}).post("/meil10/getMeilSub", send_json, function(text)
	{  
		var jsd = JSON.parse(text);

		$$("meil_board").removeView("meil_content");
		$$("meil_board").addView({id:"meil_content", rows:[]});
		for ( let i=0 ; i<jsd.length ; i++ )
		{
			let str_label = jsd[i].제목+" "+format_date(jsd[i].입력일자)+" "+format_date(jsd[i].수정일자)
			$$("meil_content").addView
			(
				{
					height:33, view:"toolbar", borderless:true, elements:
					[
						{view:"label", label:str_label},
						{view:"button", align:"left", label: '수정', autowidth:true, click:"open_meil_sub_window_update("+jsd[i].일기순번+","+jsd[i].댓글순번+")"},
					]
				}
			);

			$$("meil_content").addView
			(
				{template:jsd[i].내용1, autoheight:true}
			);

			if ((jsd[i].내용2 != "") && (jsd[i].내용2 != undefined))
				$$("meil_content").addView
				(
					{template:jsd[i].내용2, autoheight:true}
				);

			if ((jsd[i].매매구분 != "") && (jsd[i].내용2 != undefined))
				$$("meil_content").addView
				(
					{template:jsd[i].매매구분+" "+jsd[i].단축코드+":"+jsd[i].종목명+" "+jsd[i].매매수량+"개 "+format_date(jsd[i].매매일자), autoheight:true}
				);
			
			$$("meil_content").addView({height:10});
		}
	});		
}

function del_meil_sub()
{
	p_master_num = $$("contents_1").일기순번;
	p_sub_num = $$("text_meil_sub_num").getValue();
	if (p_sub_num != "새일기")
		webix.confirm({title:p_master_num+" "+p_sub_num, text:"정말 지울껴?", callback:function(result)
		{
			var send_json = {"일기순번": p_master_num, "댓글순번":p_sub_num};	
		
			if (result === true)
				webix.ajax().headers({"Content-type":"application/json"}).post("/meil10/delMeilSub", send_json, function(text)
				{
					webix.message(text);
					clear_select();
					$$("meil_sub_edit").hide();

					getPromise(1)
					.then(read_list())
					.then(read_list_gubun())
					.then(get_meil_sub_chart(p_master_num))
					.then(get_meil_sub_content(p_master_num));					
				});	
		}});
	else
		webix.message("새일기입니다. 삭제가 안되요");
}

function open_meil_sub_window_update(p_master_num, p_sub_num)
{
	var send_json = {
		"일기순번": p_master_num,
		"댓글순번": p_sub_num,
	};	
	webix.ajax().headers({"Content-type":"application/json"}).post("/meil10/getMeilSubOne", send_json, function(text)
	{  
		let jsd = JSON.parse(text)[0];

		$$("contents_1").setValue(jsd.내용1);
		$$("contents_2").setValue(jsd.내용2);
		$$("contents_1").일기순번 = jsd.일기순번;

		
		$$("text_meil_sub_num").setValue(jsd.댓글순번);
		$$("text_je").setValue(jsd.제목);
		$$("text_de").setValue(jsd.대분류);
		$$("text_jung").setValue(jsd.중분류);
		$$("text_so").setValue(jsd.소분류);
		
		$$("text_jong_code_2").setValue(jsd.단축코드);
		$$("text_jong_name_2").setValue(jsd.종목명);
		
		$$("text_meme_day").setValue(jsd.매매일자);
		$$("text_meme_gubun").setValue(jsd.매매구분);
		$$("text_meme_su").setValue(jsd.매매수량);

		$$("meil_sub_edit").show({x:200, y:300});

		$$("meil_sub_info").setHTML("["+jsd.일기순번+"] "+jsd.댓글순번+" 수정");

	});			
}
