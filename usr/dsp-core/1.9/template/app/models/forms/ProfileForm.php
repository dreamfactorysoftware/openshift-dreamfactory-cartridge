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
 * ProfileForm class.
 * ProfileForm is the data structure for keeping user profile data.
 * It is used by the 'profile' action of 'WebController'.
 */
class ProfileForm extends CFormModel
{
	public $email;
	public $first_name;
	public $last_name;
	public $display_name;
	public $security_question;
	public $security_answer;
	public $phone;
	public $default_app_id;

	/**
	 * Declares the validation rules.
	 */
	public function rules()
	{
		return array(
			// names, password, and email are required
			array( 'email, last_name, first_name, display_name', 'required' ),
			// email has to be a valid email address
			array( 'email', 'email' ),
			array( 'default_app_id', 'numerical', 'integerOnly' => true ),
			array( 'security_question, security_answer, phone, default_app_id', 'safe' ),
		);
	}

	/**
	 * Declares customized attribute labels.
	 * If not declared here, an attribute would have a label that is
	 * the same as its name with the first letter in upper case.
	 */
	public function attributeLabels()
	{
		return array(
			'email'             => 'Email Address',
			'first_name'        => 'First Name',
			'last_name'         => 'Last Name',
			'display_name'      => 'Display Name',
			'security_question' => 'Security Question',
			'security_answer'   => 'Security Answer',
			'phone'             => 'Phone',
			'default_app_id'    => 'Default Application',
		);
	}

}