import argparse
import asyncio
from orchestrator import run_full_pipeline

def main():
    parser = argparse.ArgumentParser(description="Kaaya Fit Multi-Agent Marketing System")
    parser.add_argument("action", choices=["plan", "create", "review", "distribute", "full-pipeline"],
                        help="The action to perform")
    parser.add_argument("--weeks", type=int, default=1, help="Number of weeks to plan")
    parser.add_argument("--test", action="store_true", help="Run a dry-run test")
    
    args = parser.parse_args()
    
    if args.action == "full-pipeline" or args.test:
        asyncio.run(run_full_pipeline(args.weeks))
    else:
        print(f"Running individual action '{args.action}' is not fully implemented in CLI yet. Use 'full-pipeline' or '--test'")

if __name__ == "__main__":
    main()
