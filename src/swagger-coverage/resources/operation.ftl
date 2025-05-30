<#import "ui.ftl" as ui/>

<#macro list coverage prefix>
    <div>
        <#list coverage as key, value>
            <div class="card">
                <div class="card-header">
                    <div class="row">
                        <div class="col-9">
                            ${key} ${i18["details.operation.status"]}: ${value.getResponses()?keys?join(",")}
                        </div>
                    </div>
                </div>
                <div aria-labelledby="headingOne">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-12">
                                ${i18["details.operation.parameters"]}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12">
                                <table class="table table-sm">
                                    <thead>
                                    <tr>
                                        <th scope="col">${i18["details.operation.parameter.type"]}</th>
                                        <th scope="col">${i18["details.operation.parameter.name"]}</th>
                                        <th scope="col">${i18["details.operation.parameter.value"]}</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        <#if value.getParameters()??>
                                            <#list value.getParameters() as p>
                                                <tr>
                                                    <td>${p.getName()}</td>
                                                    <#if p.getExtensions()??>
                                                        <#if p.getExtensions()["x-example"]??>
                                                            <#if p.getExtensions()["x-example"]?is_boolean>
                                                                <td>${p.getExtensions()["x-example"]?c}</td>
                                                            <#else>
                                                                <td>${p.getExtensions()["x-example"]}</td>
                                                            </#if>
                                                        </#if>
                                                    <#elseif p.getExample()??>
                                                        <#if p.getExample()?is_boolean>
                                                            <td>${p.getExample()?c}</td>
                                                        <#else>
                                                            <td>${p.getExample()}</td>
                                                        </#if>
                                                    </#if>
                                                </tr>
                                            </#list>
                                        </#if>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </#list>
        <#if coverage?size == 0>
            ${i18["details.operation.no_data"]}
        </#if>
    </div>
</#macro>

<#macro details name operationResult target>
    <div class="card">
        <div class="card-header">
            <div class="row"
                 data-toggle="collapse"
                 data-target="#${target}"
                 aria-expanded="true"
                 aria-controls="collapseOne">
                <div class="col-4">
                    <#--<#if operationResult.processCount == 0>
                        <span class="col-2">:red_circle: ${i18["common.state.no_call"]}</span>
                    <#else>
                        <#switch operationResult.state>
                            <#case "FULL">
                                <span class="col-2">:white_check_mark: ${i18["common.state.full"]}</span>
                                <#break>
                            <#case "PARTY">
                                <span class="col-2">:warning: ${i18["common.state.partial"]}</span>
                                <#break>
                            <#case "EMPTY">
                                <span class="col-2">${i18["common.state.empty"]}</span>
                                <#break>
                            <#default>
                        </#switch>
                    </#if>-->
                    <span>${operationResult.operationKey.httpMethod}</span>
                    <span>${operationResult.operationKey.path}</span>
                    <span>${operationResult.processCount} ${i18["details.operation.calls"]}</span>
                    <#--<div class="btn btn-sm">${operationResult.state} ${operationResult.operationKey.httpMethod}</div>-->
                </div>
            </div>
        </div>
        <div id="${target}" class="collapse" aria-labelledby="headingOne">
            <@conditionList list=operationResult.conditions />
        </div>
    </div>
</#macro>

<#macro conditionList list>
    <div class="card-body">
        <table class="table table-sm">
            <thead>
            <tr>
                <th scope="col">${i18["details.conditionlist.name"]}</th>
                <th scope="col">${i18["details.conditionlist.details"]}</th>
            </tr>
            </thead>
            <tbody>
            <#list list as condition>
                <#assign trStyle = "table-danger">
                <#if condition.covered>
                    <#assign trStyle = "table-success">
                </#if>
                <tr class="${trStyle}" style="color:red">
                    <td>
                        <#if condition.covered>
                            <span>✅</span>
                        <#else>
                            <span>❌</span>
                        </#if>
                        &nbsp;${condition.name}
                    </td>
                    <td>${condition.reason}</td>
                </tr>
            </#list>
            </tbody>
        </table>
    </div>
</#macro>
