#!/bin/bash
# DSP install/update utility
# Copyright (C) 2012-2014 DreamFactory Software, Inc. All Rights Reserved
#
# This file is part of the DreamFactory Services Platform(tm) (DSP)
# DreamFactory Services Platform(tm) <http://github.com/dreamfactorysoftware/dsp-core>
# Copyright 2012-2013 DreamFactory Software, Inc. <developer-support@dreamfactory.com>
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
#
# CHANGELOG:
#
# v1.3.10
#	Added support for user-defined web and install users
#
# v1.3.9
#	Added a few more cache locations to clean on a "-c"
#
# v1.3.8
#   Updated for IBM bluemix installation
#
# v1.3.7
#   Changed local store location during cleanup
#
# v1.3.6
#   More bitnami-aware. Use proper user for web user when running on a full stack
#
# v1.3.5
#   Made bitnami-aware. Use PHP from stack instead of installed version
#
# v1.3.4
#   Added "-V|--validate" command to validate installation structure
#   Ensure that web/assets directory is created and has proper permissions
#
# v1.3.3
#	Check for ".composer" directory and add to permission checks/sets
#
# v1.3.2
#	Added -i|--interactive argument
#
# v1.3.1
#	Corrected bogus message
#
# v1.3.0
#   Added checks for uid/gid and appropriate messaging
#	Corrected "getopt" usage for Mac OSs
#
# v1.2.9
#	Add .htaccess to list of files to be chown'd
#
# v1.2.8
#	Remove shared and links for launchpad, admin and web-core
#
# v1.2.7
#	Remove composer cache on clean install
#
# v1.2.6
#	Changed default perms on scripts/*.sh to 0775 from 0755 for web update
#
# v1.2.5
#	No longer stopping apache if INSTALL_USER == WEB_USER
#   Found issues surrounding current working directory when run from Apache
#
# v1.2.4
#   Moved composer.phar install directory to project root
#	Reordered the composer checks to happen after the option parsing
#
# v1.2.3.1
#   Removed exit on failed removal of shared directory
#
# v1.2.3
#   chmod 777 on shared and vendor directories so web installer can clean
#
# v1.2.2
#   Changed location of composer.phar
#	Added new argument --debug for extra verbosity
#
# v1.2.1
#   Fixed broken path link
#
# v1.2.0
#   Removed references to $HOME
#   Symlinks to shared apps made relative
#
# v1.1.6
#   Removed separate lib directory for Azure
#
# v1.1.5
#   Restored pull of submodules
#
# v1.1.4
#   chmod 777 scripts for Macs
#
# v1.1.3
#	Silence irrelevant errors on chown/chmod
#
# v1.1.2
#	Make note if composer is already installed, and if so, not remove it after run or on clean
#
# v1.1.1
# 	Added --clean flag for a clean install
#
# v1.1.0
#	Added -v verbose mode option
#	Removed lingering git junk
#
# v1.0.8
#   Installation location aware now
#  	Shared directory aware as well
#
# v1.0.7
#   Added auto-checking of OS type and set web user accordingly
#   Streamlined status output
#   Hopefully! fixed submodule shit so it pulls head properly upon update
#	Added better support for checking if a user name was passed in as an argument
#

## Get some help
. `dirname $0`/colors.sh

##
##	Initial settings
##
VERSION=1.3.10
SYSTEM_TYPE=`uname -s`
COMPOSER=composer.phar
COMPOSER_OPTIONS="--no-dev --optimize-autoloader"
NO_INTERACTION="--no-interaction"
PHP=/usr/bin/php
WEB_USER=www-data
DARWIN_WEB_USER=admin
BLUEMIX_WEB_USER=vcap
BITNAMI_WEB_USER=www-data
BITNAMI_FULL_STACK=`[ -d "../../../properties.ini" ] && grep -c 'base_stack_name=Bitnami DreamFactory Stack' ../../../properties.ini`
BASE=`pwd`
FABRIC=0
FABRIC_MARKER=/var/www/.fabric_hosted
VERBOSE=
QUIET="--quiet"
WRITE_ACCESS=0775
ALL_PERMS=0777
SCRIPT_PERMS=0775
FILE_PERMS=0664
DIR_PERMS=2775
FORCE_USER=0
EXIT_CODE=0
EXIT_CMD=()
NO_COMPOSER=0
ONLY_VALIDATE=0
BITNAMI=0
BLUEMIX=0
INSTALL_GROUP=
INSTALL_USER=


## Who am I?
if [ $UID -eq 0 ] ; then
	INSTALL_USER=${SUDO_USER}
else
	INSTALL_USER=${USER}
fi

if [ "x" = "${INSTALL_USER}x" ] ; then
	INSTALL_USER=`whoami`
fi

##	No term, no bold
if [ "x" = "${TERM}x" ] ; then
	B1=
	B2=
fi

# Check for Bluemix install
if [ "" != "${VCAP_SERVICES}" ] ; then
    # Find PHP bin
    PHP=php
#	[ -f "../php/bin/php" ] && PHP=../php/bin/php
#	[ -f "../../php/bin/php" ] && PHP=../../php/bin/php
#	[ -f "../../../php/bin/php" ] && PHP=../../../php/bin/php

	TAG="Mode: ${B1}Bluemix${B2}"
	BLUEMIX=1

# Check for Bitnami install
elif [ `basename ${BASE}` = "htdocs" ] ; then
	[ -d "../../../php/bin" ] && PHP=../../../php/bin/php

	TAG="Mode: ${B1}Bitnami${B2}"
	BITNAMI=1

	# Set bitnami apache user name based on config file if this is a hosted-VM
	if [ "${BITNAMI_FULL_STACK}" = "1" ] ; then
		if [ -d "../../../apache2/conf" ] ; then 
			BITNAMI_WEB_USER=`grep -e "^User " ../../../apache2/conf/httpd.conf |awk 'gsub("User ","")'`
			TAG="Mode: ${B1}Bitnami Full${B2}"
		fi
	fi	
else
	TAG="Mode: ${B1}Local${B2}"
fi

##
## Construct the various paths
##
BASE_PATH="`dirname "${0}" | xargs dirname`"

##	Get the REAL path of install
pushd "${BASE_PATH}" >/dev/null 2>&1
BASE_PATH=`pwd`
if [ "web" = `basename ${BASE_PATH}` ] ; then
	cd ..
	BASE_PATH=`pwd`
fi
popd >/dev/null 2>&1

LOG_DIR=${BASE_PATH}/log/
STORAGE_DIR=${BASE_PATH}/storage/
VENDOR_DIR=${BASE_PATH}/vendor
WEB_DIR=${BASE_PATH}/web
ASSETS_DIR=${WEB_DIR}/assets
COMPOSER_DIR=${BASE_PATH}
COMPOSER_CACHE="$COMPOSER_DIR/.composer"
PARSED_OPTIONS=
MY_LOG="${LOG_DIR}installer.log"
DIRS_TO_CHOWN='* .git* .dreamfactory*'
SHORT_OPTIONS="hvcDfniVu:g:"
LONG_OPTIONS="help,verbose,clean,debug,force,no-composer,interactive,validate,user:,group:"

# Hosted or standalone?
if [ -f "${FABRIC_MARKER}" ] ; then
	FABRIC=1
	TAG="Mode: ${B1}Fabric${B2}"
fi

## Set the bluemix web dir to htdocs vs. web
[ ${BLUEMIX} -eq 1 ] && WEB_DIR=${BASE_PATH}/htdocs

## Make sure we have a log directory
if [ ! -d "${LOG_DIR}" ] ; then
	mkdir -p "${LOG_DIR}" && _info "Created ${LOG_DIR}" || _error "Error creating ${LOG_DIR}"
fi

sectionHeader " ${B1}DreamFactory Services Platform(tm)${B2} ${SYSTEM_TYPE} Installer [${TAG} v${VERSION}]"

## Functions

#
# Basic usage statement
#
usage() {
	_msg "usage" ${_YELLOW} "${_ME} [options]"

	echo "Where [options] are as follows:"
	echo
	echo " -c,--clean         Removes the transient data and performs a clean install."
	echo " -D,--debug         Like --verbose plus even more information."
	echo " -f,--force         Forces installation when not running as ${B1}root${B2}."
	echo " -i,--interactive   Run Composer in interactive mode."
	echo " -n,--no-composer   Skip the Composer install/update process."
	echo " -v,--verbose       Outputs more information about the job run."
	echo " -V,--validate      Validates the installation structure."
	echo " -u,--user          (Optional) The user for this installation. Overrides any script-discovered user."
	echo " -g,--group         (Optional) The group for this installation. Overrides any script-discovered group."
	echo " -h,--help          This information."
	echo

	exit ${EXIT_CODE}
}

#
# Determine the OS type and parse arguments accordingly
#
_parse_arguments() {
	if [ "Darwin" = "${SYSTEM_TYPE}" ] ; then
		WEB_USER=${DARWIN_WEB_USER}
		_notice "OS X installation: Apache user set to \"${B1}${WEB_USER}${B2}\""
	
		PARSED_OPTIONS=`getopt ${SHORT_OPTIONS} $*`
	else
		if [ "Linux" != "${SYSTEM_TYPE}" ] ; then
			_notice "Windows/other installation. ${B1}Not fully tested so your mileage may vary${B2}."
		fi
	
		#	Execute getopt on the arguments passed to this program, identified by the special character $@
		PARSED_OPTIONS=$(getopt -n "${_ME}"  -o ${SHORT_OPTIONS} -l "${LONG_OPTIONS}"  -- "$1")
	fi

	if [ ${BLUEMIX} -eq 1 ] ; then
		WEB_USER=${BLUEMIX_WEB_USER}
	fi

	if [ ${BITNAMI} -eq 1 ] ; then
		WEB_USER=${BITNAMI_WEB_USER}
	fi
}

##
##	Makes sure our directories are in place...
##
_check_structure() {
	[ "${BITNAMI_FULL_STACK}" = "1" ] && _dbg "Bitnami full stack install (hosted VM). Web user set to \"${BITNAMI_WEB_USER}\""

	[ "${BLUEMIX}" = "1" ] && _dbg "Bluemix install. Web user set to \"${BLUEMIX_WEB_USER}\""

	if [ ! -d "${STORAGE_DIR}" ] ; then
		mkdir -p "${STORAGE_DIR}" >>${MY_LOG} 2>&1 && _info "Created ${STORAGE_DIR}" || _error "Error creating ${STORAGE_DIR}"
	fi

	if [ ! -d "${ASSETS_DIR}" ] ; then
		mkdir -p "${ASSETS_DIR}" >>${MY_LOG} 2>&1 && _info "Created ${ASSETS_DIR}" || _error "Error creating ${ASSETS_DIR}"

		_dbg "$ch{B1}own/mod${B2}ing ${B1}web/assets${B2} directory to \"${INSTALL_USER}:${WEB_USER}\/0777"
		chown -R ${INSTALL_USER}:${WEB_USER} ${ASSETS_DIR} >>${MY_LOG} 2>&1
		chmod -R ${ALL_PERMS} ${ASSETS_DIR} >>${MY_LOG} 2>&1
	fi

	[ -d "${BASE_PATH}/.composer" ] && DIRS_TO_CHOWN="${DIRS_TO_CHOWN} .composer" || _dbg "No composer cache found."

	_dbg "${B1}chown${B2}ing directories (${DIRS_TO_CHOWN}) and files to \"${INSTALL_USER}:${WEB_USER}\""
	chown -R ${INSTALL_USER}:${WEB_USER} ${DIRS_TO_CHOWN} >>${MY_LOG} 2>&1

	if [ $? -ne 0 ] ; then
		_cmd="chown -R ${INSTALL_USER}:${WEB_USER} ${DIRS_TO_CHOWN}"
		_notice "Error changing ownership of local files. Additional steps required. See note at end of run."
		_dbg "$_cmd"
		EXIT_CMD=("${EXIT_CMD[@]}" "${_cmd}")
	fi

	_dbg "Finding all directories & files needing permissions change..."
	find ./ -path ./.git -prune -o -type f -exec chmod ${FILE_PERMS} {} >>${MY_LOG} 2>&1 \; -type d -exec chmod	${DIR_PERMS} {} >>${MY_LOG} 2>&1 \;
	_dbg "Finding all scripts for permissions change..."
	find ./scripts/ -name '*.sh' -exec chmod ${SCRIPT_PERMS} {} >>${MY_LOG} 2>&1 \;
}

#	Determine OS type & parse args
_parse_arguments "$@"

#	Bad arguments, something has gone wrong with the getopt command.
if [ $? -ne 0 ] ; then
	usage
fi

#	A little magic, necessary when using getopt.
if [ "Darwin" = "${SYSTEM_TYPE}" ] ; then
	set -- ${PARSED_OPTIONS}
else
	eval set -- ${PARSED_OPTIONS}
fi

for _i
do
	case "$_i" in
		-u|--user)
			shift
			[ -n "$1" ] && INSTALL_USER=$1
			shift
			_info "Installation will use user \"${INSTALL_USER}\""
			;;

		-g|--group)
			shift
			[ -n "$1" ] && INSTALL_GROUP=$1
			shift
			_info "Installation will use group \"${INSTALL_GROUP}\""
			;;

		-i|--interactive)
			_info "Interactive mode enabled"
			NO_INTERACTION=
			shift
			;;

		-V|--validate)
			_info "Validating installation, no software installation."
			ONLY_VALIDATE=1
			shift
			;;

		-n|--no-composer)
			_info "Composer install/update will not be performed."
			NO_COMPOSER=1
			shift
			;;

		-h|--help)
			usage
	    	;;

		-f|--force)
			_notice "Forced non-root installation"
			FORCE_USER=1
			shift
	    	;;

		-v|--verbose)
			_info "Verbose mode enabled"
			VERBOSE="-v"
			QUIET=
			shift
			;;

		-D|--debug)
			_info "Extra verbose/debug logging enabled"
			VERBOSE="-vvv"
			QUIET=
			DF_DEBUG=1
			shift
			;;

		-c|--clean)
			rm -rf ${VENDOR_DIR} .composer/ composer.lock >>${MY_LOG} 2>&1
			if [ $? -ne 0 ] ; then
				_notice "Cannot remove \"${VENDOR_DIR}\", and/or \"composer.lock\"."
				_notice "Clean installation NOT guaranteed."
			else
				_info "Clean install. Dependencies removed."
			fi

			shift
			;;

		--)
			shift
			break
			;;
	esac
done

_info "Install user is ${B1}\"${INSTALL_USER}\"${B2}"

## Right groups?
if [ ${ONLY_VALIDATE} -eq 0 ] ; then
	PROPER_GROUP=`groups | grep -c ${WEB_USER}`
	if [ $UID -ne 0 ] && [ ${PROPER_GROUP} -eq 0 ] ; then
		_error
		_error "The install user (${INSTALL_USER}) is not in the web user's group (${WEB_USER})."
		_error " "
		_error "To fix this, perform one of the following options:"
		_error " "
		_error "    1. Run this script again but: with ${B1}sudo${B2}; as ${B1}root${B2}; or as the system's web user (${B1}${WEB_USER}${B2})"
		_error " "
		_error "       -- or --"
		_error " "
		_error "    2. Add your user to the system's web user's group (${B1}${WEB_USER}${B2}):"
		_error "       a. Via command line: ${B1}sudo usermod -a -G ${WEB_USER} ${USER}${B2}"
		_error "       b. Manually edit the /etc/group file (not recommended)"

		echo
		exit 1
	fi

	if [ $UID -ne 0 ] && [ ${FORCE_USER} -eq 0 ]; then
		_error
		_error "You are not running this script as root. This can result in a non-working DSP. Please run as root or use ${B1}sudo${B2}."
		_error "If you wish to run as a user other than root, please use the --force option."

		echo
		exit 1
	fi

	# Composer already installed?
	if [ ${NO_COMPOSER} -eq 0 ] ; then
		if [ -f "${COMPOSER_DIR}/${COMPOSER}" ] ; then
			_info "Composer pre-installed: ${B1}${COMPOSER_DIR}/${COMPOSER}${B2}"
			_info "Checking for package manager updates"

			${PHP} ${COMPOSER_DIR}/${COMPOSER} ${QUIET} ${VERBOSE} --no-interaction self-update
		else
			_info "No composer found, installing: ${B1}${COMPOSER_DIR}/${COMPOSER}${B2}"
			curl -s https://getcomposer.org/installer | ${PHP} -- --install-dir ${COMPOSER_DIR} ${QUIET} ${VERBOSE} --no-interaction
		fi
	fi

	##
	## Shutdown non-essential services (if root)
	##
#	if [ $UID -eq 0 ] && [ ${FABRIC} -ne 1 ] ; then
#		if [ "${WEB_USER}" != "${INSTALL_USER}" ] ; then
#			_dbg "Stopping Apache Web Server"
#			service apache2 stop >>${MY_LOG} 2>&1
#		fi
#
#		_dbg "Stopping MySQL Database Server"
#		service mysql stop >>${MY_LOG} 2>&1
#	fi

	# Git submodules (not currently used, but could be in the future)
	_dbg "Updating git submodules"
	git submodule update --init -q >>${MY_LOG} 2>&1 && _info "External modules updated"

	_dbg "Cleaning up prior cached data"
	rm -rf "${STORAGE_DIR}/.private/*.store" "/tmp/dreamfactory" "/tmp/.dsp" "/tmp/*.dfcc" "/tmp/.kc" "/tmp/.dsp-*" >/dev/null 2>&1
fi

##
## Ensure our needed directories are in place
##
_info "Checking file system structure and permissions"
_check_structure

##
##	Install composer dependencies
##
if [ ${ONLY_VALIDATE} -eq 0 ] ; then
	_dbg "Working directory: ${B1}${BASE_PATH}${B2}"
	pushd "${BASE_PATH}" >/dev/null 2>&1

	if [ ${NO_COMPOSER} -eq 0 ] ; then
		if [ ! -d "${VENDOR_DIR}" ] ; then
			_info "Installing dependencies"
			${PHP} ${COMPOSER_DIR}/${COMPOSER} ${QUIET} ${VERBOSE} ${NO_INTERACTION} ${COMPOSER_OPTIONS} install ; _code=$?
		else
			_info "Updating dependencies"
			${PHP} ${COMPOSER_DIR}/${COMPOSER} ${QUIET} ${VERBOSE} ${NO_INTERACTION} ${COMPOSER_OPTIONS} update; _code=$?
		fi

		[ ${_code} -ne 0 ] && _error "Composer did not complete successfully (${_code}). Some features may not operate properly."
	fi

	if [ -d "${VENDOR_DIR}" ] ; then
		chown -R :${WEB_USER} ${VENDOR_DIR} ./composer.lock >>${MY_LOG} 2>&1
		if [ $? -ne 0 ] ; then
			_cmd="chown -R :${WEB_USER} ${VENDOR_DIR} ./composer.lock"
			_notice "Error changing group of vendor and/or composer.lock. Additional steps required. See note at end of run."
			_dbg "$_cmd"
			EXIT_CMD=("${EXIT_CMD[@]}" "${_cmd}")
		fi
	fi
fi

##
## make owned by user with group of web-user
##
chown -R ${INSTALL_USER}:${WEB_USER} ${DIRS_TO_CHOWN} >>${MY_LOG} 2>&1
if [ $? -ne 0 ] ; then
	_cmd="chown -R ${INSTALL_USER}:${WEB_USER} ${DIRS_TO_CHOWN}"
	_notice "Error changing ownership of local files. Additional steps required. See note at end of run."
	_dbg "$_cmd"
	EXIT_CMD=("${EXIT_CMD[@]}" "${_cmd}")
fi

##
## make writable by web server and ensure group write bits are set properly...
##
chmod -R ${DIR_PERMS} ${STORAGE_DIR} ${LOG_DIR} >>${MY_LOG} 2>&1
if [ $? -ne 0 ] ; then
	_cmd="chmod -R ${WRITE_ACCESS} ${STORAGE_DIR} ${LOG_DIR}"
	_notice "Error changing permissions of web-accessible assets. Additional steps required. See note at end of run."
	_dbg "$_cmd"
	EXIT_CMD=("${EXIT_CMD[@]}" "${_cmd}")
fi

##
## Restart non-essential services (if root)
##
if [ ${ONLY_VALIDATE} -eq 0 ] ; then
	if [ $UID -eq 0 ] && [ ${FABRIC} -ne 1 ] ; then
#		service mysql start >>${MY_LOG} 2>&1

		if [ "${WEB_USER}" != "${INSTALL_USER}" ] ; then
			service apache2 restart >>${MY_LOG} 2>&1
		else
			service apache2 reload >>${MY_LOG} 2>&1
		fi
	fi
fi

if [ ! -z "${EXIT_CMD}" ] ; then
	EXIT_CODE=2
	_notice
	_notice "Be sure to run the following commands (with ${B1}sudo${B2} as shown) in order to complete installation:"

	for _cmd in "${EXIT_CMD[@]}" ;
	do
		_notice "    ${B1}sudo $_cmd${B2}"
	done

	_notice
fi

## And we're spent...
_info "Complete. Enjoy the rest of your day!"
echo

exit 0
