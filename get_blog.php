<?php
	require 'config.php';

	//判断用户名是否重复

	$query=@mysql_query(" SELECT title,content,date FROM blog_blog ORDER BY date DESC LIMIT 0,3 ")or die('SQL错误！');

	$json='';

	while(!!$row=mysql_fetch_array($query,MYSQL_ASSOC)){ //  !!双感叹号将$row转换成布尔值

		$json.=json_encode($row).',';					//	.',' 表示在每一条博文末尾加上逗号

	}

	//sleep(3);
	
	echo '['.substr($json, 0,strlen($json)-1).']';				//去掉末尾的逗号

	mysql_close();
?>