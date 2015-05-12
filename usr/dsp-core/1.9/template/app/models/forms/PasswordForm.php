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
 * PasswordForm class.
 * PasswordForm is the data structure password change data.
 * It is used by the 'password' action of 'WebController'.
 */
class PasswordForm extends CFormModel
{
	public $old_password;
	public $new_password;
	public $repeat_password;

	/**
	 * Declares the validation rules.
	 */
	public function rules()
	{
		return array(
			// all fields are required
			array( 'old_password, new_password, repeat_password', 'required' ),
			// password repeat must match new password
			array( 'repeat_password', 'required' ),
			array( 'repeat_password', 'compare', 'compareAttribute' => 'new_password' ),
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
			'old_password'    => 'Old Password',
			'new_password'    => 'New Password',
			'repeat_password' => 'Verify New Password',
		);
	}

}