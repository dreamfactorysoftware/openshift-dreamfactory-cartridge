# DreamFactory OpenShift Cartridge

DreamFactory is an open source mobile backend that provides RESTful services
for building modern applications.

This cartridge lets you instantly deploy DreamFactory on OpenShift. To create
an application using this cartridge, simply type
    
    $ rhc app create dreamfactory http://cartreflect-claytondev.rhcloud.com/reflect?github=dreamfactorysoftware/dreamfactory-openshift-cartridge

This should clone the newly created app into `./dreamfactory`. In case it
doesn't, run the following to clone the app:
    
    $ rhc clone -a dreamfactory -n <your-openshift-domain>

You can access your instance of the DreamFactory platform at
`dreamfactory-<your-openshift-domain>.rhcloud.com`.


