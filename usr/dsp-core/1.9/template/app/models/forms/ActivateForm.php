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
use DreamFactory\Platform\Yii\Components\DrupalUserIdentity;
use DreamFactory\Yii\Utility\Pii;

/**
 * ActivateForm class.
 * ActivateForm is the data structure for keeping DSP activate form data.
 * It is used by the 'activate' action of 'WebController'.
 */
class ActivateForm extends CFormModel
{
	/**
	 * @var string
	 */
	public $username;
	/**
	 * @var string
	 */
	public $password;
	/**
	 * @var DrupalUserIdentity
	 */
	protected $_identity;

	/**
	 * Declares the validation rules.
	 * The rules state that username and password are required,
	 * and password needs to be authenticated.
	 */
	public function rules()
	{
		return array(
			array( 'username, password', 'required' ),
			array( 'password', 'authenticate' ),
		);
	}

	/**
	 * Declares attribute labels.
	 */
	public function attributeLabels()
	{
		return array(
			'username' => 'Email Address',
			'password' => 'Password',
		);
	}

	/**
	 * Authenticates the password.
	 * This is the 'authenticate' validator as declared in rules().
	 */
	public function authenticate( $attribute, $params )
	{
		if ( !$this->hasErrors() )
		{
			$this->_identity = new DrupalUserIdentity( $this->username, $this->password );

			if ( $this->_identity->authenticate() )
			{
				return true;
			}

			$this->addError( 'password', 'The email address and/or password are not valid credentials.' );
		}

		return false;
	}

	/**
	 * Logs in the user using the given username and password in the model.
	 *
	 * @return boolean whether activate is successful
	 */
	public function activate()
	{
		$_identity = $this->_identity;

		if ( empty( $_identity ) )
		{
			$_identity = new DrupalUserIdentity( $this->username, $this->password );

			if ( !$_identity->authenticate() )
			{
				$_identity = null;

				return false;
			}
		}

		if ( \CBaseUserIdentity::ERROR_NONE == $_identity->errorCode )
		{
			$this->_identity = $_identity;

			return Pii::user()->login( $_identity );
		}

		return false;
	}

	/**
	 * @param DrupalUserIdentity $drupalIdentity
	 *
	 * @return ActivateForm
	 */
	public function setDrupalIdentity( $drupalIdentity )
	{
		$this->_identity = $drupalIdentity;

		return $this;
	}

	/**
	 * @return DrupalUserIdentity
	 */
	public function getDrupalIdentity()
	{
		return $this->_identity;
	}
}
