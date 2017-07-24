/*
 * Copyright (c) 2015, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.wso2telco.analytics.ids.report.generator;


public interface HEFailedReportGenerationService {

    public void generate(HEFailedReportComponents heFailedReportComponents);

    public String getFilenames(String filePath);

    public boolean moveFile(String path,String fileName);

    public String getUuid();

    public String getFileName();

    public String checkNull(String value);
}
