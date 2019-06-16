<?php

// $page = $_POST['page'];//当前页数
// $limit = $_POST['limit'];//一页需要显示多少个
// $where = $_POST['where'];

// $sql = 'select * from table where title='.$where['title']. ' limit '.$between;

$res = [
            'pagecount' => 3,
            'list' => [
            	['id'=>1,'user_name'=>'sadfasffasdf'],['id'=>2,'user_name'=>'adsfadsf'],['id'=>3,'user_name'=>'dsfafdsf']
            ],
        ];

echo json_encode($res);