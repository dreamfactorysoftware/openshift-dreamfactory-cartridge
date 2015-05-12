<?php
/**
 * Var dumper
 */

$_cwd = getcwd();
$_home = dirname( $_cwd );
$_vendor = $_home . '/vendor';
$_app = $_home . '/app';
$_models = $_app . '/models';
$_autoload = ( file_exists( $_vendor . '/autoload.php' ) && is_readable( $_vendor . '/autoload.php' ) );
$_appRight = is_dir( $_models );

$_html = null;
$_vars = \Kisma::get( null );

if ( !empty( $_vars ) )
{
    foreach ( $_vars as $_key => $_value )
    {
        switch ( $_value )
        {
            case false === $_value:
                $_value = '<strong>FALSE</strong>';
                break;

            case true === $_value:
                $_value = '<strong>TRUE</strong>';
                break;

            case null === $_value:
                $_value = '<strong>NULL</strong>';
                break;

            default:
            case is_string( $_value ):
                $_value = '' . $_value . '';
                break;

            case !is_scalar( $_value ):
                $_value = '<code>' . print_r( $_value, true ) . '</code>';
                break;
        }

        $_html .= <<<HTML
    <tr>
        <td>{$_key}</td>
        <td>{$_value}</td>
    </tr>
HTML;
    }
}
?>
<div class="container-fluid">
    <div class="jumbotron">
        <h2>Platform Settings</h2>

        <div class="table-responsive">
            <table class="table table-condensed table-hover table-bordered table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Value</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td>Current Path</td>
                        <td><?php echo $_cwd; ?></td>
                    </tr>
                    <tr>
                        <td>Vendor Path</td>
                        <td><?php echo $_vendor; ?></td>
                    </tr>
                    <tr>
                        <td>Home Path</td>
                        <td><?php echo $_home; ?></td>
                    </tr>
                    <tr>
                        <td>App Path</td>
                        <td><?php echo $_app; ?></td>
                    </tr>
                    <tr>
                        <td>Autoloader available?</td>
                        <td><?php echo $_autoload ? 'Yes' : 'No'; ?></td>
                    </tr>
                    <tr>
                        <td>App path correct?</td>
                        <td><?php echo $_appRight ? 'Yes' : 'No'; ?></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h2>Kisma Settings</h2>

        <div class="table-responsive">
            <table class="table table-condensed table-hover table-bordered table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <?php echo $_html; ?>
            </table>
        </div>
    </div>
</div>