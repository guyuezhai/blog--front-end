<?php
	require 'config.php';

	//判断用户名是否重复

	$query=@mysql_query(" SELECT user FROM blog_user WHERE 
											user='{$_POST['user']}' ")or die('SQL错误！');

	if(mysql_fetch_array($query,MYSQL_ASSOC)){
		// sleep(3);
		echo 1;
	}
	mysql_close();
?>