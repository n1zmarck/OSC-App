use meval::Expr;

pub struct CustomExpressionEngine;

impl CustomExpressionEngine {
    pub fn evaluate_expression(formula: &str, input_val: f64, time: f64) -> Result<f64, String> {
        let expr: Expr = formula.parse().map_err(|e| format!("Formula parse error: {}", e))?;
        
        let func = expr.bind2("in1", "time")
            .map_err(|e| format!("Variable bind error: {}", e))?;

        Ok(func(input_val, time))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_expression_eval() {
        let res = CustomExpressionEngine::evaluate_expression("(in1 * 2.0) + 10.0", 5.0, 0.0).unwrap();
        assert_eq!(res, 20.0);
    }
}
