<?php
use DreamFactory\Platform\Exceptions\ForbiddenException;
use DreamFactory\Platform\Resources\User\Session;
use DreamFactory\Platform\Yii\Models\User;

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
 * SupportForm
 */
class SupportForm extends CFormModel
{
	//*************************************************************************
	//	Members
	//*************************************************************************

	/**
	 * @var string
	 */
	protected $_emailAddress;
	/**
	 * @var bool
	 */
	protected $_skipped = false;

	//*************************************************************************
	//	Methods
	//*************************************************************************

	/**
	 * Declares the validation rules.
	 */
	public function rules()
	{
		return array(
			array( 'emailAddress', 'email' ),
			array( 'skipped', 'boolean' ),
		);
	}

	/**
	 * @param array $attributes
	 * @param bool  $clearErrors
	 *
	 * @throws DreamFactory\Platform\Exceptions\ForbiddenException
	 * @return bool
	 */
	public function validate( $attributes = null, $clearErrors = true )
	{
		if ( $this->_skipped )
		{
			$this->_emailAddress = null;

			return true;
		}

		/** @var User $_user */
		if ( null === ( $_user = User::model()->findByPk( Session::getCurrentUserId() ) ) )
		{
			throw new ForbiddenException();
		}

		if ( empty( $this->_emailAddress ) )
		{
			$this->_emailAddress = $_user->email;
		}

		return parent::validate( $attributes, $clearErrors );
	}

	/**
	 * Declares attribute labels.
	 */
	public function attributeLabels()
	{
		return array(
			'emailAddress' => 'Email Address',
		);
	}

	/**
	 * @param string $emailAddress
	 *
	 * @return SupportForm
	 */
	public function setEmailAddress( $emailAddress )
	{
		$this->_emailAddress = $emailAddress;

		return $this;
	}

	/**
	 * @return string
	 */
	public function getEmailAddress()
	{
		return $this->_emailAddress;
	}

	/**
	 * @param boolean $skipped
	 *
	 * @return SupportForm
	 */
	public function setSkipped( $skipped )
	{
		$this->_skipped = $skipped;

		return $this;
	}

	/**
	 * @return boolean
	 */
	public function getSkipped()
	{
		return $this->_skipped;
	}
}
