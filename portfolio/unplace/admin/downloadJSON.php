<?php
if (isset($_POST['data'])) {
	$json = $_POST['data'];
	$filename = $_POST['filename'];
	header("Content-disposition: attachment; filename=$filename");
	header('Content-type: application/json; charset=utf-8');
	echo urldecode($json);
} else {
	echo "Erro na criacao do ficheiro";
}

?>