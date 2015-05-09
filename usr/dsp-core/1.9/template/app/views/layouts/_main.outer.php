<?php
/**
 * This file is part of the DreamFactory Services Platform(tm) (DSP)
 *
 * DreamFactory Services Platform(tm) <http://github.com/dreamfactorysoftware/dsp-core>
 * Copyright 2012-2014 DreamFactory Software, Inc. <support@dreamfactory.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * This is the partial view for the outer portion of the main template for the server-side views.
 *
 * @var string        $content
 * @var WebController $this
 * @var array         $versions
 */
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>DreamFactory Services Platform&trade;</title>
    <meta name="page-route" content="web/index" />

    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, user-scalable=yes, initial-scale=1.0">
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="author" content="DreamFactory Software, Inc.">
    <meta name="language" content="en" />
    <link rel="shortcut icon" href="/img/df-icon-256x256.png" />

    <!-- Bootstrap 3 CSS -->
    <link rel="stylesheet"
        href="//netdna.bootstrapcdn.com/bootstrap/<?php echo $_versions['bootstrap']; ?>/css/bootstrap.min.css">

    <!-- Font Awesome -->
    <link rel="stylesheet"
        href="//netdna.bootstrapcdn.com/font-awesome/<?php echo $_versions['font-awesome']; ?>/css/font-awesome.min.css">

    <!-- DSP UI Styles & Code -->
    <link rel="stylesheet" href="/css/dsp.main.css">

    <script src="//ajax.googleapis.com/ajax/libs/jquery/<?php echo $_versions['jquery']; ?>/jquery.min.js"></script>
</head>
<body>

<?php require __DIR__ . '/_main.inner.php'; ?>

<script src="//netdna.bootstrapcdn.com/bootstrap/<?php echo $_versions['bootstrap']; ?>/js/bootstrap.min.js"></script>
<script src="/js/dsp.ui.js"></script>
</body>
</html>
