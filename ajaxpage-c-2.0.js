	/*ajax分页

*/
function ajaxpage(opts){

var limit = opts.limit; //每页显示多少条
var url = opts.url; //获取数据的连接
var where1 = opts.where;    //条件

var page = opts.page;   //当前页
var allpagecount = opts.allpagecount;   //总页数
var jump = Boolean(opts.jump);   //是否启用跳转
var progress = Boolean(opts.progress);  //是否启用进度条

if(jump===true)
{
    jump = 1;
}else{
    jump = 0;
}

if(progress===true)
{
    progress = 1;
}else{
    progress = 0;
}

//把obj转成字符串，方便存在html中
if(typeof(where1)=='object')
{
    var where_arr = new Array();

    var k = 0;
    for(var key in where1)
    {
        where_arr[k] = key+':'+where1[key];
        k++;
    }

    var where1 = where_arr.join(',');
}

/*----- 页码列表的样式设置 ---------------------------------*/

//全局样式
var style = opts.style;
style = style?style:'width:auto;height:auto;color:#000;display:initial;margin: 0 5px;text-align: right;line-height: 20px;border-spacing: 0;text-decoration: none; -moz-border-bottom-colors: none; -moz-border-left-colors: none; -moz-border-right-colors: none; -moz-border-top-colors: none;border-color: #e6e6e6 #e6e6e6 #e6e6e6 #e6e6e6;border-image: none;border-style: solid solid solid solid;border-width: 1px 1px 1px 1px;cursor: pointer;display: inline;float: left;font-family: u5b8bu4f53,Arial;font-size: 14px;padding:3px 7px;';

//当前页的样式
var current_style = opts.current_style;
current_style = current_style?current_style:'display:initial;background: #009bde none repeat scroll 0 0;color:#fff;';


//其他页
var other_style = opts.other_style;
other_style = other_style?other_style:'display:initial;background: #f6f6f6 none repeat scroll 0 0;';

//跳转按钮样式
var skip_style = opts.skip_style;
skip_style = skip_style?skip_style:'display:initial;background: #009bde none repeat scroll 0 0;color:#fff;';

/*------ 样式设置end -------------------------------------*/

//点击跳转到某一页
if(page=='skip')
{
    var skip_Page_val = $('#skip_Page_val').val();
    page = skip_Page_val?skip_Page_val:1
}

page = page?parseInt(page):1;
limit = parseInt(limit);

if(isNaN(page)) page = 1;
if(page<1) page=1;
if(page>allpagecount) page=allpagecount;

page = page==0?1:page;

where = where1?",'"+where1+"'":",'"+''+"'";//where条件，用于搜索时分页

//把where字符串转成json
var where_obj = new Array();
if(where1)
{
    var where_arr = where1.split(',');

    var k = 0;
    for(var key in where_arr)
    {
        var where_one = where_arr[key].split(':');

        where_obj[k] = '"'+where_one[0]+'":"'+where_one[1]+'"';

        k++;
    }

    where_obj = '{'+where_obj.join(',')+'}';
    where_obj = $.parseJSON(where_obj);    //转成object
}

var between = (page-1)*limit+','+limit;

//显示进度条
if(progress && (0<$('#ajaxpage_progress_bar').length))
{
    doProgress(0,80,15);
}

$.ajax({
    url:url,
    type:'post',
    dataType:'json',
    async:true,
    data:{page:page,limit:limit,between:between,where:where_obj},
    success:function(res)
    {
        var allpagecount = parseInt(Math.ceil(res.pagecount/limit));//总页数
        allpagecount = isNaN(allpagecount)?0:allpagecount;
        var pagecount = parseInt(allpagecount>2?2:allpagecount);//码数条显示3个页码，当前页显示在中间，所以2

        var show = '';

        if((page>allpagecount-1) && (allpagecount-3>0) )
        {
            var start = allpagecount-2;
        }else if(page-1>pagecount){
            var start = page-1;
        }else{
            var start = 1;
        }

        /*-------- 遍历数据  ----------------------------------------------*/

        eachdata(res.list,res.pagecount?res.pagecount:0,allpagecount);//必须在此函数外面写一个名为eachdata(res)的函数用来遍历数据

        /*-------- 遍历数据end  ----------------------------------------------*/

        if(allpagecount>1)
        {
            for(var i=start;i<start+3;i++)
            {
                if(i>allpagecount)
                {
                    break;//如果没有了数据即不在继续输出页码
                }

                if(i==page)
                {
                    var pageone = '<li id="ajaxpage_current_page" style="'+current_style+style+'">'+i+'</li>';
                }else{
                    var pageone = '<li onclick="ajaxpage({'+"'limit':'"+limit+"','url':'"+url+"','where':'"+where1+"','page':'"+i+"','allpagecount':'"+allpagecount+"','progress':"+progress+",'jump':"+jump+""+'})" style="'+other_style+style+'">'+i+'</li>';
                }
                show += pageone;

            }

            var qiandian = start!=1?'<li onclick="ajaxpage({'+"'limit':'"+limit+"','url':'"+url+"','where':'"+where1+"','page':'"+1+"','allpagecount':'"+allpagecount+"','progress':"+progress+",'jump':"+jump+""+'})" style="'+other_style+style+'"><<</li>':'';
            var houdian  = i<=allpagecount?'<li onclick="ajaxpage({'+"'limit':'"+limit+"','url':'"+url+"','where':'"+where1+"','page':'"+allpagecount+"','allpagecount':'"+allpagecount+"','progress':"+progress+",'jump':"+jump+""+'})" style="'+other_style+style+'">>></li>':'';

            //如果当前页不是第一页就显示上一页按钮
            var pageup = page!=1?'<li onclick="ajaxpage({'+"'limit':'"+limit+"','url':'"+url+"','where':'"+where1+"','page':'"+(page-1)+"','allpagecount':'"+allpagecount+"','progress':"+progress+",'jump':"+jump+""+'})" style="'+other_style+style+'"><</li>':'';

            //如果当前页不是最后一页就显示下一页按钮
            var pagedown = page!=allpagecount?'<li onclick="ajaxpage({'+"'limit':'"+limit+"','url':'"+url+"','where':'"+where1+"','page':'"+(page+1)+"','allpagecount':'"+allpagecount+"','progress':"+progress+",'jump':"+jump+""+'})" style="'+other_style+style+'">></li>':'';

            var skip = '';
            if(allpagecount>3 && jump)
            {
                skip += '<div style="margin-left: 4%;line-height: 45px;" class="searchPage">';
                skip += '<span style="padding: 8px 0;color: #999999;font-size: 14px;line-height: 45px;" class="page-go">';
                skip += '<span style="padding: 0 13px;line-height: 45px;text-align: center;" class="page-sum">共<strong class="allPage">'+allpagecount+'</strong>页</span>';
                skip += '跳转到<input style="display:initial;float:none;width: 25px;height: 22px;margin: 0 5px;padding-left: 5px;border: 1px solid #e4e4e4;padding: 0;" type="text" id="skip_Page_val">页'
                skip += '<a onclick="ajaxpage({'+"'limit':'"+limit+"','url':'"+url+"','where':'"+where1+"','page':'skip','allpagecount':'"+allpagecount+"','progress':"+progress+",'jump':"+jump+""+'})" style="padding:2px 2px;font-size:13px;float:none;'+skip_style+'" href="javascript:void(0);" class="page-btn">GO</a>'
                skip += '</span>'
                skip += '</div>'
            }else{
                var skip = '';
            }

            $('#showpage').html('<ul style="margin: 0 12px;display: inline-block;padding-left: 0;border-radius: 4px;">'+qiandian+pageup+show+pagedown+houdian+'</ul>'+skip+'<div style="clear:both"></div>');
        }else{
            $('#showpage').html('');
        }

        //显示进度条
        if(progress && (0<$('#ajaxpage_progress_bar').length))
        {
            comProgress();  //完成
        }
    }
});
};

//进度条----------------------------------------------------------------------
//显示进度条的id
var progress_id = "ajaxpage_progress_bar";

if($("#" + progress_id))
{
    $("#" + progress_id).css({'width':'100%','height':'5px','background-color':'#fff'});

    //加入进度条
    var loading  = '<div style="width:100%;height:5px;display:none;">';
        loading +=      '<div style="height:5px;background:#7ECEF0;border-right:0px solid red;"></div>';
        loading += '</div>';

    $("#" + progress_id).html(loading);
}

function SetProgress(progress) 
{ 
    if (progress) { 
        $("#" + progress_id + " >div> div").css("width", String(progress) + "%"); //控制#loading div宽度 
    } 
}

var settime = '';

//i:从哪开始
//far：从哪结束
//time：速度
function doProgress(i,far,time)
{ 
    clearTimeout(settime);
    if(i>=100)
    {
        $("#" + progress_id + " > div").animate({

           opacity: "hide"

       }, "slow");
        return;
    }

    if (i <= far) 
    {
        var inc = 1;

        //小于等于80是加载中
        if(far<=80)
        {
            if(i>=80)
            {
                inc = 0.4;
            }else if(i>70){
                inc = 0.01;
            }else if(i>60){
                inc = 0.05;
            }else if(i>50){
                inc = 0.1;
            }else if(i>40){
                inc = 0.15;
            }else{
                inc = 0.2;
            }
        }

        i = i+inc;

        $("#" + progress_id + " > div").show();
        settime = setTimeout('doProgress('+i+','+far+','+time+')', time); 
        SetProgress(i); 
    }
}
//加载完成，获取长度百分比，加速完成进度条
function comProgress()
{
    var qwe1 = $("#" + progress_id + " >div").width();
    var qwe2 = $("#" + progress_id + " >div> div").width();
    qwe = qwe2/qwe1*100;
    qwe = Math.ceil(qwe)
    doProgress(qwe,100,0.1);
}
//进度条===========================================================================