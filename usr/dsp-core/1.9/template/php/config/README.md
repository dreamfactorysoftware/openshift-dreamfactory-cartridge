## DSP Configuration Helpers
This directory, config, contains the configuration files that define various aspects of the operations of your DSP. Many of these can be augmented and/or completely overridden. Only files that end in **.php** will be loaded, and only specifically named ones at that.

In this directory there are sub-directories that contain **template** files for various main configuration files that can be overridden. They are:

 * databases -- configurations for non-default (MySQL) local and PaaS system databases
 * external -- configuration templates for use with external servers. Included are **apache** and **nginx** configuration examples.
 * local -- configuration templates for private, or local, things. Things like oauth keys, or environment variables. Any file derived from a `config/local` template will automatically be ignored by git. If you add files to this directory, be sure to edit `.gitignore` accordingly.
 * manifests -- manifest.yml templates for CloudFoundry-ish PaaS deployments
 * reserved -- unused by DSP. Basically, it's just a place for us to put our stuff that we aren't quite sure we want to delete yet.

> Be aware that more directories, or consolidation may occur in the future. However, this will only affect documentation that names the location of these distribution files. The DSP only uses config  files in the root `config` directory.

 Instructions are included with each, but they are all the same:

 1. Copy the distribution file to the config directory
 2. Make your changes to the defaults or whatever
 3. Remove the **-dist** from the end of the file name (database configs are a bit different in this aspect).
 4. Restart your web server.

If you want to use the default database that comes with the DSP, nothing needs to be done.
