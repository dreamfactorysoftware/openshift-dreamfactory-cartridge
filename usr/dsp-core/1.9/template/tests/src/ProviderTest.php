<?php
namespace DreamFactory\Platform;

use DreamFactory\Platform\Utility\Fabric;

class ProviderTest extends \PHPUnit_Framework_TestCase
{
    //******************************************************************************
    //* Constants
    //******************************************************************************

    /**
     * @type string
     */
    const API_KEY = 'some-api-key';

    //*************************************************************************
    //	Methods
    //*************************************************************************

    protected function setUp()
    {
        if ( !isset( $_SERVER ) )
        {
            $_SERVER = array();
        }

        $_SERVER['DOCUMENT_ROOT'] = '/var/www/launchpad/web';
        rename( '/var/www/.fabric_hosted.off', '/var/www/.fabric_hosted' );

        $_providers = Fabric::getProviderCredentials();

        $this->assertTrue( is_array( $_providers ) );
    }

    protected function tearDown()
    {
        rename( '/var/www/.fabric_hosted', '/var/www/.fabric_hosted.off' );
    }

    public function testFabric()
    {
        $this->assertTrue( is_string( Fabric::hostedPrivatePlatform( true ) ) );
    }

}
