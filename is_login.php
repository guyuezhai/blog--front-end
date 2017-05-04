<?php
	require 'config.php';

	//接收传过来的加密 密码

	$_pass=sha1($_POST['pass']);

	//判断用户名是否重复

	$query=@mysql_query(" SELECT user FROM blog_user WHERE 
											user='{$_POST['user']}'AND pass='{$_pass}' ")or die('SQL错误！');

	if(mysql_fetch_array($query,MYSQL_ASSOC)){  //用户名和密码正确

		//sleep(3);
		echo 0;
	}else{		//用户名和密码不正确
		//sleep(3);
		echo 1;
	}

	mysql_close();

?>