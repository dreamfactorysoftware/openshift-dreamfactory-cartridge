<?php
use DreamFactory\Yii\Utility\Pii;
use Kisma\Core\Utility\Curl;
use Kisma\Core\Utility\FilterInput;

/**
 * @var string          $content
 * @var ConsoleController $this
 */
$_route = $this->route;
$_step = 'light';
$_headline = 'DSP Settings';
$_themeList = null;

//	Change these to update the CDN versions used. Set to false to disable
$_bootstrapVersion = '3.1.1'; // Set to false to disable
$_bootswatchVersion = '3.1.1';
$_dataTablesVersion = '1.9.4';
$_bootswatchTheme = FilterInput::request( 'theme', Pii::getState( 'admin.default_theme', 'default' ), FILTER_SANITIZE_STRING );
Pii::setState( 'dsp.admin_theme', $_bootswatchTheme );
$_useBootswatchThemes = ( 'default' != $_bootswatchTheme );
$_fontAwesomeVersion = '4.0.3'; // Set to false to disable
$_jqueryVersion = '1.11.0';

$_themes = array(
    'Default',
    'Amelia',
    'Cerulean',
    'Cosmo',
    'Cyborg',
    'Flatly',
    'Journal',
    'Readable',
    'Simplex',
    'Slate',
    'Spacelab',
    'United',
);

$_url = Curl::currentUrl( false );

foreach ( $_themes as $_item )
{
    $_name = strtolower( $_item );
    $_class = ( $_bootswatchTheme == $_name ) ? 'class="active"' : null;

    $_themeList
        .= <<<HTML
	<li {$_class}><a href="{$_url}?theme={$_name}">{$_item}</a></li>
HTML;
}

//	Our css building begins...
$_css = '<link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700,800" rel="stylesheet" type="text/css">';
$_scripts = null;

if ( $_useBootswatchThemes )
{
    $_css
        .= '<link href="//netdna.bootstrapcdn.com/bootswatch/' .
           $_bootswatchVersion .
           '/' .
           $_bootswatchTheme .
           '/bootstrap.min.css" rel="stylesheet" media="screen">';
}
else if ( false !== $_bootstrapVersion )
{
    $_css .= '<link href="//netdna.bootstrapcdn.com/bootstrap/' . $_bootstrapVersion . '/css/bootstrap.min.css" rel="stylesheet"  media="screen">';
}

if ( false !== $_fontAwesomeVersion )
{
    $_css .= '<link href="//netdna.bootstrapcdn.com/font-awesome/' . $_fontAwesomeVersion . '/css/font-awesome.min.css" rel="stylesheet">';
}

if ( false !== $_dataTablesVersion )
{
    $_css .= '<link href="/css/df.datatables.css" rel="stylesheet">';
}

if ( false !== $_jqueryVersion )
{
    $_scripts .= '<script src="//ajax.googleapis.com/ajax/libs/jquery/' . $_jqueryVersion . '/jquery.min.js"></script>';
}
?>
<!DOCTYPE html><!-- m -->
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>DreamFactory Services Platform&trade;</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta charset="utf-8">
    <?php echo $_css; ?>
    <?php echo $_scripts; ?>
    <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->    <!--[if lt IE 9]>
    <script src="/js/html5shiv.js"></script>
    <script src="/js/respond.min.js"></script>    <![endif]-->
    <link rel="icon" type="image/png" href="/images/logo-48x48.png">
    <link href="/css/dsp.main.css" rel="stylesheet">
    <link href="/css/dsp.ui.css" rel="stylesheet">
</head>
<body>
<div id="wrap">
    <div class="navbar navbar-default navbar-fixed-top">
        <div class="container">
            <div class="navbar-header">
                <button data-target=".navbar-collapse" data-toggle="collapse" class="navbar-toggle" type="button">
                    <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span>
                </button>
                <a href="#" class="navbar-brand"><?php echo $_headline; ?></a>
            </div>

            <div class="collapse navbar-collapse">
                <ul class="nav navbar-nav">
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" id="themes">Themes <b class="caret"></b></a>

                        <ul class="dropdown-menu"><?php echo $_themeList; ?></ul>
                    </li>
                    <li class="dropdown">
                        <a class="dropdown-toggle" data-toggle="dropdown" href="#" id="download">Downloads <b class="caret"></b></a>

                        <ul class="dropdown-menu">
                            <li class="dropdown-header">Source Code</li>
                            <li>
                                <a href="https://github.com/dreamfactorysoftware/dsp-core">GitHub</a>
                            </li>
                            <li class="dropdown-header">Linux Packages</li>
                            <li>
                                <a href="#">Redhat</a>
                            </li>
                            <li>
                                <a href="#">Ubuntu</a>
                            </li>
                            <li>
                                <a href="#">CentOS</a>
                            </li>
                            <li>
                                <a href="#">Debian</a>
                            </li>
                            <li class="dropdown-header">Virtual Machine Images</li>
                            <li>
                                <a href="#">Amazon EC2 AMI</a>
                            </li>
                            <li>
                                <a href="">Windows Azure VHD</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="http://blog.dreamfactory.com/blog">Blog</a>
                    </li>
                    <li>
                        <a href="#">Support</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>

    <div class="container"><?php echo $content; ?></div>
</div>

<div id="footer">
    <div class="container">
        <div class="social-links pull-right">
            <ul class="list-inline">
                <li>
                    <a href="http://facebook.com/dreamfactory"><i class="icon-facebook-sign icon-2x"></i></a>
                </li>
                <li>
                    <a href="https://twitter.com/dfsoftwareinc"><i class="icon-twitter-sign icon-2x"></i></a>
                </li>
                <li>
                    <a href="https://github.com/dreamfactorysoftware"><i class="icon-github-sign icon-2x"></i></a>
                </li>
            </ul>
        </div>

        <div class="clearfix"></div>
        <p>
			<span class="left">All source code is licensed under the <a
                    href="http://www.apache.org/licenses/LICENSE-2.0">Apache License v2.0</a></span>
            <span class="pull-right">&copy; DreamFactory Software, Inc. <?php echo date( 'Y' ); ?>. All Rights Reserved.</span>
        </p>
    </div>
</div>

<?php
if ( false !== $_bootstrapVersion )
{
    echo '<script src="//netdna.bootstrapcdn.com/bootstrap/' . $_bootstrapVersion . '/js/bootstrap.min.js"></script>';
}

if ( false !== $_dataTablesVersion )
{
    echo '<script src="//ajax.aspnetcdn.com/ajax/jquery.dataTables/' . $_dataTablesVersion . '/jquery.dataTables.min.js"></script>';
    echo '<script src="/js/df.datatables.js"></script>';
}
?>
</body>
</html>
