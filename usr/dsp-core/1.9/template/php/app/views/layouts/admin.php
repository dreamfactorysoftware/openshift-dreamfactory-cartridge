<?php
/**
 * @var string          $content
 * @var ConsoleController $this
 */
$_route = $this->route;
$_step = 'light';
$_headline = 'Platform Administration';

?><!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>DreamFactory Services Platform&trade;</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="author" content="DreamFactory Software, Inc.">
	<meta name="language" content="en" />
	<link rel="shortcut icon" href="/images/logo-32x32.png" />
	<link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700,800" rel="stylesheet" type="text/css">
	<style>
		body {
			padding-top: 60px; /* 60px to make the container go all the way to the bottom of the topbar */
		}
	</style>
	<link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.2/css/bootstrap-combined.min.css" rel="stylesheet">
	<link href="//netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome.css" rel="stylesheet">
	<link href="/css/jquery-ui.css" rel="stylesheet">
	<!--	<link href="/js/jtable/themes/metro/darkorange/jtable.min.css" rel="stylesheet">-->    <!--[if IE 7]>
	<link href="//netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome-ie7.css" rel="stylesheet">    <![endif]-->
	<link href="//cdnjs.cloudflare.com/ajax/libs/x-editable/1.4.5/bootstrap-editable/css/bootstrap-editable.css" rel="stylesheet" />
	<link href="/css/jquery.dataTables.css" rel="stylesheet">
	<link rel="stylesheet" type="text/css" href="/css/main.css" />
	<!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->    <!--[if lt IE 9]>
	<script src="//html5shim.googlecode.com/svn/trunk/html5.js"></script>    <![endif]-->
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
	<script src="//ajax.aspnetcdn.com/ajax/jquery.dataTables/1.9.4/jquery.dataTables.min.js"></script>
</head>
<body>
	<div class="navbar navbar-fixed-top">
		<div class="navbar-inner">
			<div class="container">
				<a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse"> <span class="icon-bar"></span> <span class="icon-bar"></span>
					<span class="icon-bar"></span> </a> <img id="logo-img" src="/images/logo-48x48.png">

				<a class="brand" href="#"><?php echo $_headline; ?></a>

				<div class="nav-collapse collapse">
					<ul class="nav"></ul>
				</div>
			</div>
		</div>
	</div>
	<div class="container admin-content <?php echo $_step; ?>">
		<?php echo $content; ?>
		<footer>
			<p class="pull-right">&copy; DreamFactory Software, Inc. <?php echo date( 'Y' ); ?>. All Rights Reserved.</p>
		</footer>
	</div>
	<!-- /container -->
	<script src="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.2/js/bootstrap.min.js"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/x-editable/1.4.5/bootstrap-editable/js/bootstrap-editable.min.js"></script>
	<script src="/js/app.jquery.js"></script>
</body>
</html>
