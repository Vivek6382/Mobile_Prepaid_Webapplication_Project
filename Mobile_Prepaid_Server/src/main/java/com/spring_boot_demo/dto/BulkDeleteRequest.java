package com.spring_boot_demo.dto;

import java.util.List;

public class BulkDeleteRequest {
    private List<Long> planIds;

    public List<Long> getPlanIds() {
        return planIds;
    }

    public void setPlanIds(List<Long> planIds) {
        this.planIds = planIds;
    }
}
