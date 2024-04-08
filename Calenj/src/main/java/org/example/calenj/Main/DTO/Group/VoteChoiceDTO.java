package org.example.calenj.Main.DTO.Group;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.calenj.Main.domain.UserEntity;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoteChoiceDTO {
    private UUID choiceId;
    private String voteItem;
    private List<String> voter;

    public List<String> getBlindedVoter(List<String> countVoter,String id) {
        List<String> blindedValues = new ArrayList<>();
        for (String value : countVoter) {
            if (!value.equals(id)) {
                blindedValues.add("-");
            } else {
                blindedValues.add(value);
            }
        }
        return blindedValues;
    }
}
