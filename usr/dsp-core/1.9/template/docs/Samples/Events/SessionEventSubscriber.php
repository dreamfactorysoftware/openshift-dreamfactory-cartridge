<?php
namespace DreamFactory\Samples\Events;

use DreamFactory\Platform\Events\EventDispatcher;
use DreamFactory\Platform\Events\PlatformServiceEvent;
use DreamFactory\Platform\Utility\Platform;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * SessionEventSubscriber.php
 * An example class that listens for session logouts
 */
class SessionEventSubscriber implements EventSubscriberInterface
{
    /**
     * Constructor
     */
    public function __construct()
    {
        //  Register with the event dispatcher
        Platform::getDispatcher()->addSubscriber( $this );
    }

    /**
     * Return the list of events to which we wish to subscribe
     *
     * @return array
     */
    public static function getSubscribedEvents()
    {
        return array(
            'session.login'  => array( 'onSessionLogin', 0 ),
            'session.logout' => array( 'onSessionLogout', 0 ),
        );
    }

    /**
     * Called on 'session.login'
     *
     * @param PlatformServiceEvent $event
     * @param string           $eventName
     * @param EventDispatcher  $dispatcher
     */
    public function onSessionLogin( PlatformServiceEvent $event, $eventName, $dispatcher )
    {
        //  Do something useful
    }

    /**
     * Called on 'session.logout'
     *
     * @param PlatformServiceEvent $event
     * @param string           $eventName
     * @param EventDispatcher  $dispatcher
     */
    public function onSessionLogout( PlatformServiceEvent $event, $eventName, $dispatcher )
    {
        //  Do something useful
    }
}
