<#import "operation.ftl" as operation />

<#macro list coverage prefix>
    <div class="accordion" id="${prefix}-accordion">
        <#list coverage?sort_by("path") as key>
            <@operation.details
            name=key
            operationResult=operationMap[key]
            target=prefix + "-" + key?counter
            />
        </#list>
    </div>
</#macro>