<?php
namespace DreamFactory\Platform;

use DreamFactory\Platform\Components\EventProxy;
use DreamFactory\Platform\Events\Enums\PlatformServiceEvents;
use DreamFactory\Platform\Utility\Platform;
use DreamFactory\Platform\Utility\RestResponse;
use DreamFactory\Platform\Utility\ServiceHandler;
use DreamFactory\Yii\Utility\Pii;
use Kisma\Core\Interfaces\HttpMethod;
use Kisma\Core\Utility\FilterInput;
use Kisma\Core\Utility\Inflector;

require_once dirname( dirname( __DIR__ ) ) . '/app/controllers/RestController.php';

/**
 * EventTests.php
 */
class EventTests extends \PHPUnit_Framework_TestCase
{
	const API_KEY = 'some-api-key';

	protected $_preProcessFired = 0;
	protected $_postProcessFired = 0;
	protected $_actionEventFired = 0;

	//*************************************************************************
	//	Methods
	//*************************************************************************

	protected function setUp()
	{
		parent::setUp();
		@unlink( '/tmp/.action-event-receiver-data' );
	}

	public function testServiceRequestEvents()
	{
		//	A post test
		Platform::on( 'user.list', 'http://dsp.local/web/eventReceiver', static::API_KEY );

		//	An inline test
		Platform::on(
			'user.list',
			function ( $event, $eventName, $dispatcher )
			{
				$this->assertEquals( 'user.list', $eventName );
				$this->_actionEventFired = 1;
				echo 'event "user.list" has been fired.';

			},
			static::API_KEY
		);

		$this->_preProcessFired = $this->_postProcessFired = 0;

		$_config = require( dirname( dirname( __DIR__ ) ) . '/config/web.php' );

		/** @var \RestController $_controller */
		list( $_controller, $_actionId ) = Pii::app()->createController( 'rest/user' );

		try
		{
			$_controller->setService( 'user' );
			$_service = ServiceHandler::getService( $_controller->getService() );

			$_service->on(
				PlatformServiceEvents::PRE_PROCESS,
				function ( $event, $eventName, $dispatcher )
				{
					$this->assertEquals( 'user.get.pre_process', $eventName );
					$this->_preProcessFired = 1;
				}
			);

			$_service->on(
				PlatformServiceEvents::POST_PROCESS,
				function ( $event, $eventName, $dispatcher )
				{
					$this->assertEquals( 'user.get.post_process', $eventName );
					$this->_postProcessFired = 1;
				}
			);

			//	Test GET
			$_request = Pii::app()->getRequestObject();
			$_request->query->set( 'app_name', Inflector::neutralize( __CLASS__ ) );
			$_request->overrideGlobals();

			$_response = $_service->processRequest( null, HttpMethod::GET, false );
			$this->assertTrue( is_array( $_response ) && isset( $_response['resource'] ) );
			$this->assertTrue( 1 == $this->_preProcessFired && 1 == $this->_postProcessFired && 1 == $this->_actionEventFired );
		}
		catch ( \Exception $ex )
		{
			RestResponse::sendErrors( $ex );
		}
	}

	/**
	 * Override base method to do some processing of incoming requests
	 *
	 * @param \CAction $action
	 *
	 * @return bool
	 * @throws Exception
	 */
	protected function _beforeAction( $action )
	{
		/**
		 * fix the slash at the end, Yii removes trailing slash by default,
		 * but it is needed in some APIs to determine file vs folder, etc.
		 * 'rest/<service:[_0-9a-zA-Z-]+>/<resource:[_0-9a-zA-Z-\/. ]+>'
		 */
		$_path = $_service = FilterInput::get( $_GET, 'path', null, FILTER_SANITIZE_STRING );
		$_resource = null;

		if ( false !== ( $_pos = strpos( $_path, '/' ) ) )
		{
			$_service = substr( $_path, 0, $_pos );
			$_resource = $_pos < strlen( $_path ) ? substr( $_path, $_pos + 1 ) : null;

//			// fix removal of trailing slashes from resource
//			if ( !empty( $this->_resource ) )
//			{
//				$requestUri = Yii::app()->request->requestUri;
//
//				if ( ( false === strpos( $requestUri, '?' ) && '/' === substr( $requestUri, strlen( $requestUri ) - 1, 1 ) ) ||
//					 ( '/' === substr( $requestUri, strpos( $requestUri, '?' ) - 1, 1 ) )
//				)
//				{
//					$this->_resource .= '/';
//				}
//			}
		}

		return array( $_service, $_resource );
	}

}
